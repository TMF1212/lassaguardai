import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bell, Phone, MessageSquare, CheckCircle2, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import AnimatedSection from "./AnimatedSection";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

const AlertSubscription = () => {
  const [phone, setPhone] = useState("");
  const [alertType, setAlertType] = useState<"sms" | "whatsapp">("sms");
  const [state, setState] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !state) return;

    // Basic phone validation
    const cleanPhone = phone.replace(/\s+/g, "");
    if (!/^\+?\d{10,15}$/.test(cleanPhone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number (e.g. +2348012345678)",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("alert_subscriptions").insert({
      phone_number: cleanPhone,
      alert_type: alertType,
      state,
      language,
    });

    if (error) {
      toast({ title: "Error", description: "Failed to subscribe. Please try again.", variant: "destructive" });
    } else {
      setSubscribed(true);
      toast({ title: "✅ Subscribed!", description: `You'll receive ${alertType.toUpperCase()} alerts for ${state} state.` });
    }
    setIsSubmitting(false);
  };

  if (subscribed) {
    return (
      <AnimatedSection>
        <section className="py-16 bg-gradient-to-br from-accent/5 via-background to-primary/5">
          <div className="container mx-auto px-4">
            <Card className="max-w-lg mx-auto border-accent/30 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-display font-bold mb-2">You're Subscribed!</h3>
                <p className="text-muted-foreground mb-4">
                  You'll receive outbreak alerts for <strong>{state}</strong> state via{" "}
                  <strong>{alertType === "whatsapp" ? "WhatsApp" : "SMS"}</strong>.
                </p>
                <Button variant="outline" onClick={() => setSubscribed(false)}>
                  Subscribe Another Number
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection>
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/15 border-0">
              <Bell className="w-3 h-3 mr-1.5" />
              Outbreak Alerts
            </Badge>
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
              Stay Informed, Stay Safe
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Subscribe to receive real-time Lassa fever outbreak alerts for your state via SMS or WhatsApp.
            </p>
          </div>

          <Card className="max-w-lg mx-auto border-border/50 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Subscribe to Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubscribe} className="space-y-4">
                {/* Alert Type Toggle */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={alertType === "sms" ? "default" : "outline"}
                    className="flex-1 gap-2"
                    onClick={() => setAlertType("sms")}
                  >
                    <Phone className="w-4 h-4" />
                    SMS
                  </Button>
                  <Button
                    type="button"
                    variant={alertType === "whatsapp" ? "default" : "outline"}
                    className="flex-1 gap-2"
                    onClick={() => setAlertType("whatsapp")}
                  >
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp
                  </Button>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
                  <Input
                    type="tel"
                    placeholder="+234 801 234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    maxLength={16}
                  />
                </div>

                {/* State */}
                <div>
                  <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    Your State
                  </label>
                  <Select value={state} onValueChange={setState} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {NIGERIAN_STATES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full gap-2" disabled={isSubmitting || !phone.trim() || !state}>
                  {isSubmitting ? (
                    <div className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                  {isSubmitting ? "Subscribing..." : "Subscribe to Alerts"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  We'll only send outbreak-related alerts. You can unsubscribe anytime.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </AnimatedSection>
  );
};

export default AlertSubscription;
