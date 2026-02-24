import { Shield, Globe, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-foreground text-background py-12 md:py-16 safe-area-bottom">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-12">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary flex items-center justify-center">
                <Shield className="w-4 h-4 md:w-5 md:h-5 text-background" />
              </div>
              <span className="font-display font-bold text-lg md:text-xl">LassaGuard<span className="text-primary">AI</span></span>
            </div>
            <p className="text-background/70 mb-5 max-w-md text-sm md:text-base leading-relaxed">
              AI-powered Lassa fever prevention and early detection platform for Africa. Helping African communities detect risk early, prevent outbreaks, and save lives.
            </p>
            <div className="flex items-center gap-2 text-xs md:text-sm text-background/60">
              <Heart className="w-3.5 h-3.5 text-destructive" />
              <span>Built with purpose for global health equity</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-sm uppercase tracking-wider text-background/80">Platform</h4>
            <ul className="space-y-2.5 text-background/70 text-sm">
              <li><Link to="/risk-checker" className="hover:text-primary transition-colors">{t("riskChecker")}</Link></li>
              <li><Link to="/prevention" className="hover:text-primary transition-colors">{t("prevention")}</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">{t("about")}</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">{t("signIn")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-sm uppercase tracking-wider text-background/80">Legal & Ethics</h4>
            <ul className="space-y-2.5 text-background/70 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Data Ethics</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Accessibility</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-xs md:text-sm text-background/60">
              © 2026 LassaGuard AI. All rights reserved. Not for medical diagnosis.
            </p>
            <p className="text-xs md:text-sm text-background/70 mt-1">
              Developed by <span className="text-primary font-medium">Matthew Falade</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs md:text-sm text-background/60 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 md:w-4 md:h-4" />
              {t("sdgAligned")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
