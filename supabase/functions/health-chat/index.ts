import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ALLOWED_LANGUAGES = ["English", "French", "Hausa", "Yoruba", "Igbo", "en", "fr", "ha", "yo", "ig"];
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;
const ALLOWED_ROLES = new Set(["user", "assistant"]);

// Simple in-memory rate limiter (per-IP, resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 20; // 20 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

const systemPrompt = `You are HealthGuard AI, a helpful public health education assistant focused on Lassa fever prevention and awareness. You provide accurate, culturally sensitive health information in the user's preferred language.

IMPORTANT GUIDELINES:
1. NEVER provide medical diagnosis or prescribe treatments
2. ALWAYS include this disclaimer: "This information is for educational purposes only. Please consult a healthcare professional for medical advice."
3. Focus on prevention, awareness, and when to seek care
4. Be empathetic and supportive
5. Respond in the same language the user writes in
6. Keep responses concise and easy to understand for low-literacy users
7. Use simple words and short sentences

TOPICS YOU CAN HELP WITH:
- Lassa fever symptoms and warning signs
- Prevention methods (rodent control, food storage, hygiene)
- When to seek medical care
- Isolation and infection control basics
- Supporting family members who are ill
- General hygiene and sanitation
- Endemic areas and travel precautions

TOPICS TO AVOID:
- Specific medication dosages or prescriptions
- Definitive diagnosis
- Treatment protocols (refer to healthcare providers)
- Unverified claims or cures

If asked about diagnosis or treatment, guide users to seek professional medical care immediately.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { messages, language } = body;

    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
      return new Response(JSON.stringify({ error: "Invalid request format." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Sanitize messages: only allow user/assistant roles, cap content length
    const sanitizedMessages = messages
      .filter((m: any) => m && typeof m.content === "string" && ALLOWED_ROLES.has(m.role))
      .map((m: any) => ({
        role: m.role,
        content: m.content.slice(0, MAX_MESSAGE_LENGTH),
      }));

    if (sanitizedMessages.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid request format." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate language
    const safeLanguage = typeof language === "string" && ALLOWED_LANGUAGES.includes(language) ? language : "";

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const languageInstruction = safeLanguage ? `\n\nIMPORTANT: Respond in ${safeLanguage}. The user prefers communication in this language.` : "";
    
    console.log("Calling Lovable AI with", sanitizedMessages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt + languageInstruction },
          ...sanitizedMessages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response from AI gateway");
    
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("health-chat error:", error);
    return new Response(JSON.stringify({ error: "An unexpected error occurred. Please try again." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});