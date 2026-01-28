import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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
    const { messages, language } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const languageInstruction = language ? `\n\nIMPORTANT: Respond in ${language}. The user prefers communication in this language.` : "";
    
    console.log("Calling Lovable AI with messages:", JSON.stringify(messages.slice(-3)));

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
          ...messages,
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
        return new Response(JSON.stringify({ error: "AI service requires credits. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI service error" }), {
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
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
