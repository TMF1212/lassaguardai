import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HealthChatbot from "@/components/HealthChatbot";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Target, Globe, Heart, Lock, Zap } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Ethical AI",
      description: "Our AI provides risk stratification, never diagnosis. All outputs are explainable and transparent.",
    },
    {
      icon: Lock,
      title: "Privacy-First",
      description: "User consent by default. Data anonymization. GDPR/HIPAA-ready architecture.",
    },
    {
      icon: Globe,
      title: "Global Scale",
      description: "Designed to expand worldwide and support multiple epidemic-prone diseases.",
    },
    {
      icon: Zap,
      title: "Always Free",
      description: "Risk assessment is always free for individuals. We never monetize patient data.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-6">
              About LassaGuard AI
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We are building AI-powered infrastructure to protect Nigerian communities from the ongoing Lassa fever outbreak. 
              Our platform combines responsible AI with public health expertise to enable early detection, 
              improve prevention, and strengthen outbreak response across Nigeria's endemic states.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {values.map((value, index) => (
              <Card key={index}>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold font-display mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-0">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold">Our Mission</h2>
                  <p className="text-muted-foreground">AI for Global Health Equity</p>
                </div>
              </div>
              <p className="text-lg leading-relaxed mb-6">
                To democratize access to early disease risk detection and prevention knowledge, 
                empowering communities and health systems to respond faster and save lives.
              </p>
              <div className="grid sm:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-background rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-1">2026</div>
                  <div className="text-sm text-muted-foreground">Founded</div>
                </div>
                <div className="p-4 bg-background rounded-lg">
                  <div className="text-3xl font-bold text-accent mb-1">36</div>
                  <div className="text-sm text-muted-foreground">Nigerian States</div>
                </div>
                <div className="p-4 bg-background rounded-lg">
                  <div className="text-3xl font-bold text-success mb-1">100%</div>
                  <div className="text-sm text-muted-foreground">Free for Public</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
      <HealthChatbot />
    </div>
  );
};

export default About;