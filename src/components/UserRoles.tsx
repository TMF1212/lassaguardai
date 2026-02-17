import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Stethoscope, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const UserRoles = () => {
  const roles = [
    {
      icon: Users,
      title: "Community / Public",
      description: "Free access to AI-powered risk assessment, prevention education, and healthcare facility locator.",
      features: ["Symptom checker", "Risk classification", "Nearby facilities", "Prevention tips"],
      action: "Check Your Risk",
      href: "/risk-checker",
      gradient: "gradient-accent",
    },
    {
      icon: Stethoscope,
      title: "Healthcare Worker",
      description: "Secure case management with clinical decision support and structured reporting tools.",
      features: ["Case dashboard", "Clinical checklists", "Isolation guidance", "Case reporting"],
      action: "Healthcare Login",
      href: "/login",
      gradient: "gradient-hero",
    },
    {
      icon: Building2,
      title: "Public Health Authority",
      description: "Global analytics dashboard with outbreak detection and exportable intelligence reports.",
      features: ["Heat maps", "Trend detection", "Early warnings", "Data exports"],
      action: "Authority Login",
      href: "/login",
      gradient: "gradient-hero",
    },
  ];

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Designed for Every Stakeholder
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Role-based access ensures the right tools reach the right people, from Nigerian communities to NCDC and health authorities.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className={`absolute top-0 left-0 right-0 h-2 ${role.gradient}`} />
              <CardHeader className="pt-8">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <role.icon className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-xl font-display">{role.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">{role.description}</p>
                <ul className="space-y-2 mb-6">
                  {role.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to={role.href}>
                  <Button className="w-full" variant={index === 0 ? "default" : "outline"}>
                    {role.action}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserRoles;