import { Card, CardContent } from "@/components/ui/card";
import { Activity, Shield, MapPin, Users, Brain, Lock } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Risk Assessment",
      description: "Non-diagnostic symptom and exposure checker powered by responsible AI for early risk stratification.",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: MapPin,
      title: "Outbreak Intelligence",
      description: "Real-time geographic heat maps and trend detection for public health authorities.",
      color: "bg-accent/10 text-accent",
    },
    {
      icon: Shield,
      title: "Prevention Education",
      description: "Multilingual, accessible health education resources tailored to local contexts.",
      color: "bg-success/10 text-success",
    },
    {
      icon: Users,
      title: "Healthcare Support",
      description: "Case tracking dashboards and WHO/CDC-aligned clinical guidance for healthcare workers.",
      color: "bg-warning/10 text-warning",
    },
    {
      icon: Activity,
      title: "Early Warning System",
      description: "Pattern detection algorithms to identify potential outbreaks before they spread.",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Lock,
      title: "Privacy-First Design",
      description: "GDPR/HIPAA-ready architecture with data anonymization and user consent by default.",
      color: "bg-accent/10 text-accent",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Comprehensive Health Protection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for communities, healthcare workers, and public health authorities with ethical AI at its core.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold font-display mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;