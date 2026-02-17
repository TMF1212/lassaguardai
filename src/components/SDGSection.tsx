import { Card, CardContent } from "@/components/ui/card";
import { Heart, Target, Globe, Users } from "lucide-react";

const SDGSection = () => {
  const goals = [
    {
      icon: Heart,
      title: "Universal Health Coverage",
      description: "Free risk assessment for all individuals regardless of location or economic status.",
    },
    {
      icon: Target,
      title: "Early Detection",
      description: "AI-powered pattern recognition to identify outbreaks before they escalate.",
    },
    {
      icon: Globe,
      title: "Global Scalability",
      description: "Designed to expand to multiple diseases and regions without rebuilding.",
    },
    {
      icon: Users,
      title: "Community Empowerment",
      description: "Prevention education in local languages with accessible, low-literacy friendly interfaces.",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <span>UN Sustainable Development Goals</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Aligned with <span className="text-primary">SDG 3:</span> Good Health and Well-being
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our platform directly supports global health targets by enabling early detection, improving prevention, and strengthening Nigeria's health systems in Lassa-endemic communities.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {goals.map((goal, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <goal.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{goal.title}</h4>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-0">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl font-display font-bold text-primary">3</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-4">Good Health and Well-being</h3>
                  <p className="text-muted-foreground mb-6">
                    Ensure healthy lives and promote well-being for all at all ages
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-background rounded-lg">
                      <div className="text-2xl font-bold text-primary">3.3</div>
                      <div className="text-xs text-muted-foreground">End Epidemics</div>
                    </div>
                    <div className="p-4 bg-background rounded-lg">
                      <div className="text-2xl font-bold text-accent">3.8</div>
                      <div className="text-xs text-muted-foreground">Universal Coverage</div>
                    </div>
                    <div className="p-4 bg-background rounded-lg">
                      <div className="text-2xl font-bold text-success">3.d</div>
                      <div className="text-xs text-muted-foreground">Early Warning</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SDGSection;