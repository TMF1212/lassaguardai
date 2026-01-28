import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Bot, User, Loader2, AlertCircle, X, Minimize2, Maximize2 } from "lucide-react";
import { Language, languageNames, translations } from "@/types/riskChecker";
import LanguageSelector from "./LanguageSelector";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const chatTranslations: Record<string, Record<Language, string>> = {
  title: {
    en: "Health Assistant",
    fr: "Assistant Santé",
    ha: "Mai Taimakon Lafiya",
    yo: "Oluranlọwọ Ilera",
    ig: "Onye enyemaka ahụike",
  },
  placeholder: {
    en: "Ask about Lassa fever prevention...",
    fr: "Posez une question sur la prévention de Lassa...",
    ha: "Tambayi game da kariya daga cutar Lassa...",
    yo: "Beere nipa idena iba Lassa...",
    ig: "Jụọ maka mgbochi ọrịa Lassa...",
  },
  welcome: {
    en: "Hello! I'm your health education assistant. Ask me anything about Lassa fever prevention, symptoms to watch for, or when to seek medical care. I'm here to help! 🏥",
    fr: "Bonjour ! Je suis votre assistant d'éducation à la santé. Posez-moi des questions sur la prévention de la fièvre de Lassa, les symptômes à surveiller ou quand consulter. Je suis là pour vous aider ! 🏥",
    ha: "Sannu! Ni ne mai taimakon ilimin lafiya. Ka tambaye ni duk abin da ya shafi kariya daga cutar Lassa, alamomin da za a kula da su, ko lokacin da za a nemi kulawar likita. Ina nan don taimaka! 🏥",
    yo: "Pẹlẹ o! Mo jẹ oluranlọwọ ẹkọ ilera rẹ. Beere lọwọ mi ohunkohun nipa idena iba Lassa, awọn aami aisan lati ṣọra fun, tabi nigba ti o yẹ ki o wa itọju. Mo wa nibi lati ṣe iranlọwọ! 🏥",
    ig: "Nnọọ! Abụ m onye enyemaka mmụta ahụike gị. Jụọ m ihe ọ bụla gbasara mgbochi ọrịa Lassa, ihe mgbaàmà a ga-ele anya, ma ọ bụ oge a ga-achọ nlekọta. Anọ m ebe a inyere aka! 🏥",
  },
  error: {
    en: "Sorry, I couldn't process your message. Please try again.",
    fr: "Désolé, je n'ai pas pu traiter votre message. Veuillez réessayer.",
    ha: "Yi hakuri, ban iya sarrafa saƙonka ba. Da fatan za a sake gwadawa.",
    yo: "Ma binu, mi ko le ṣe iṣẹ ifiranṣẹ rẹ. Jọwọ gbiyanju lẹẹkansi.",
    ig: "Ndo, enweghị m ike ịrụ ozi gị. Biko nwaa ọzọ.",
  },
  send: {
    en: "Send",
    fr: "Envoyer",
    ha: "Aika",
    yo: "Firanṣẹ",
    ig: "Zipu",
  },
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-chat`;

const HealthChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: "assistant", content: chatTranslations.welcome[language] }]);
    }
  }, [isOpen, language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const streamChat = async (userMessage: string) => {
    const userMsg: Message = { role: "user", content: userMessage };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          language: languageNames[language],
        }),
      });

      if (!resp.ok || !resp.body) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get response");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantContent = "";
      let streamDone = false;

      // Add empty assistant message
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: assistantContent };
                return updated;
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: chatTranslations.error[language] },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput("");
    streamChat(trimmed);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 z-50 shadow-2xl border-2 transition-all duration-300 ${isMinimized ? "w-72 h-14" : "w-[380px] h-[520px]"}`}>
      <CardHeader className="p-3 border-b flex flex-row items-center justify-between bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <CardTitle className="text-base font-semibold">{chatTranslations.title[language]}</CardTitle>
        </div>
        <div className="flex items-center gap-1">
          {!isMinimized && <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[calc(100%-56px)]">
          {/* Disclaimer */}
          <div className="bg-warning/10 border-b border-warning/20 px-3 py-2 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              {translations.disclaimer[language].split(".")[0]}.
            </p>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-3" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown>{msg.content || "..."}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-2 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-secondary rounded-xl px-3 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={chatTranslations.placeholder[language]}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      )}
    </Card>
  );
};

export default HealthChatbot;
