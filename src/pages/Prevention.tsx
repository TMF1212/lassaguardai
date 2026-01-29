import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HealthChatbot from "@/components/HealthChatbot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Utensils, Bug, HandMetal, Stethoscope, AlertTriangle } from "lucide-react";

const Prevention = () => {
  const tips = [
    {
      icon: Home,
      title: "Keep Your Home Clean",
      description: "Store food in sealed containers. Clean up spills immediately. Block holes and gaps where rodents can enter.",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Bug,
      title: "Rodent Control",
      description: "Set traps around your home. Dispose of garbage properly. Keep your compound and surroundings clean.",
      color: "bg-accent/10 text-accent",
    },
    {
      icon: Utensils,
      title: "Food Safety",
      description: "Cook food thoroughly. Cover food and water. Never eat food that may have been contaminated by rodents.",
      color: "bg-success/10 text-success",
    },
    {
      icon: HandMetal,
      title: "Personal Hygiene",
      description: "Wash hands frequently with soap and water. Avoid touching your face. Use protective gloves when cleaning.",
      color: "bg-warning/10 text-warning",
    },
    {
      icon: Stethoscope,
      title: "Seek Care Early",
      description: "If you develop fever, headache, or other symptoms, seek medical attention immediately. Early treatment saves lives.",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: AlertTriangle,
      title: "Avoid Contact",
      description: "Do not touch sick people without protection. Healthcare workers should use proper PPE at all times.",
      color: "bg-destructive/10 text-destructive",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Prevention & Education
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn how to protect yourself and your community from Lassa fever and other epidemic diseases.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {tips.map((tip, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl ${tip.color} flex items-center justify-center mb-2`}>
                    <tip.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg font-display">{tip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-display font-bold mb-4">Know the Symptoms</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Early symptoms of Lassa fever include fever, weakness, headache, sore throat, and muscle pain. 
                In severe cases, bleeding may occur. Seek medical attention if you experience these symptoms.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {["Fever", "Headache", "Weakness", "Sore Throat", "Muscle Pain", "Bleeding"].map((symptom) => (
                  <span key={symptom} className="px-4 py-2 bg-background rounded-full text-sm font-medium">
                    {symptom}
                  </span>
                ))}
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

export default Prevention;