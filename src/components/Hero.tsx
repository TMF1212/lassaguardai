import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Activity, Globe, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const stats = [
    { icon: Users, value: "200M+", label: "Nigerians at Risk" },
    { icon: Globe, value: "36", label: "States Monitored" },
    { icon: Activity, value: "10K+", label: "Cases Tracked Yearly" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 gradient-hero" />
      
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-white/90 text-sm font-medium">🇳🇬 Nigeria Focus • SDG 3 Aligned • AI-Powered</span>
          </div>

          <p className="text-white/70 text-sm mb-6 font-medium">Developed by Matthew Falade</p>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight">
            Protecting Communities from
            <span className="block text-accent">Lassa Fever Disease</span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            AI-powered early risk detection, outbreak intelligence, and prevention support to protect Nigerian communities from the ongoing Lassa fever crisis.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/risk-checker">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 text-lg">
                Check Your Risk
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg">
                Learn More
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-6 h-6 text-accent mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;