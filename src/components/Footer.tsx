import { Shield, Mail, Globe, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl">LassaGuard<span className="text-primary">AI</span></span>
            </div>
            <p className="text-background/70 mb-6 max-w-md">
              AI-powered Lassa fever prevention and early detection platform. Helping communities detect risk early, prevent outbreaks, and save lives.
            </p>
            <div className="flex items-center gap-2 text-sm text-background/60">
              <Heart className="w-4 h-4 text-destructive" />
              <span>Built with purpose for global health equity</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-background/70">
              <li><Link to="/risk-checker" className="hover:text-primary transition-colors">Risk Checker</Link></li>
              <li><Link to="/prevention" className="hover:text-primary transition-colors">Prevention</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Healthcare Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal & Ethics</h4>
            <ul className="space-y-2 text-background/70">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Data Ethics</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Accessibility</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-background/60">
              © 2026 LassaGuard AI. All rights reserved. Not for medical diagnosis.
            </p>
            <p className="text-sm text-background/70 mt-1">
              Developed by <span className="text-primary font-medium">Matthew Falade</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-background/60 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              SDG 3 Aligned
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;