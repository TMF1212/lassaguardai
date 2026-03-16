import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Activity, Globe, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Hero = () => {
  const { t } = useLanguage();

  const stats = [
    { icon: Users, value: "200M+", label: t("nigeriansAtRisk") },
    { icon: Globe, value: "36", label: t("statesMonitored") },
    { icon: Activity, value: "10K+", label: t("casesTracked") },
  ];

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 gradient-hero" />

      <div className="relative z-10 container mx-auto px-4 py-20 pt-24 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/10 backdrop-blur-sm border border-card/20 mb-5">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-card/90 text-xs sm:text-sm font-medium">
              {t("sdgAligned")} • {t("aiPowered")} • {t("privacyFirst")}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-bold text-card mb-5 md:mb-6 leading-[1.1] tracking-tight">
            {t("heroTitle1")}
            <span className="block">{t("heroTitle2")}</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-card/80 mb-3 max-w-2xl mx-auto leading-relaxed">
            {t("heroDesc")}
          </p>

          {/* Developer attribution */}
          <p className="text-lg md:text-xl font-bold mb-3 bg-gradient-to-r from-accent via-yellow-300 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
            {t("developedBy")}
          </p>

          <p className="text-card/60 text-sm md:text-base mb-8 md:mb-10">
            {t("sdgAligned")} • {t("privacyFirst")}
          </p>

          {/* Directional arrow pointing to CTA */}
          <div className="flex flex-col items-center mb-4">
            <span className="text-accent font-semibold text-sm sm:text-base animate-bounce mb-1">👇 {t("startHere") ?? "Start Here"}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 md:mb-16 px-2">
            <Link to="/risk-checker" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-10 py-7 text-lg sm:text-xl shadow-[0_4px_20px_-4px_hsl(158_55%_42%/0.5)] active:scale-[0.98] transition-all ring-2 ring-accent/30 ring-offset-2 ring-offset-transparent animate-pulse-slow"
              >
                <Shield className="mr-2 w-6 h-6" />
                {t("checkYourRisk")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/about" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 border-0 px-8 py-6 text-base sm:text-lg font-semibold active:scale-[0.98] transition-transform"
              >
                {t("learnMore")}
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent mx-auto mb-1.5 sm:mb-2" />
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-card font-display">{stat.value}</div>
                <div className="text-[11px] sm:text-sm text-card/60 leading-tight mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
