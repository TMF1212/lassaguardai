import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Shield, Globe, Users, Activity, LogIn, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language, languageNames } from "@/types/riskChecker";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: t("signOut"), description: "You have been signed out." });
    setIsOpen(false);
  };

  const navLinks = [
    { href: "/", label: t("home"), icon: Globe },
    { href: "/risk-checker", label: t("riskChecker"), icon: Activity },
    { href: "/prevention", label: t("prevention"), icon: Shield },
    { href: "/about", label: t("about"), icon: Users },
    ...(user ? [{ href: "/dashboard", label: t("dashboard"), icon: Activity }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  const languageFlags: Record<Language, string> = {
    en: "🇬🇧", fr: "🇫🇷", ha: "🇳🇬", yo: "🇳🇬", ig: "🇳🇬",
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-b border-border/40 safe-area-top">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl gradient-hero flex items-center justify-center shadow-sm">
              <Shield className="w-4 h-4 md:w-5 md:h-5 text-card" />
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="font-display font-bold text-base md:text-lg text-foreground tracking-tight">LassaGuard</span>
              <span className="text-primary font-bold text-base md:text-lg">AI</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right section */}
          <div className="hidden md:flex items-center gap-2">
            {/* Language Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-muted-foreground hover:text-foreground"
                  aria-label={t("language")}
                >
                  <span className="text-base" aria-hidden="true">{languageFlags[language]}</span>
                  <span className="text-xs font-medium uppercase tracking-wide">{language}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[160px]">
                {(Object.keys(languageNames) as Language[]).map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`text-sm py-2.5 cursor-pointer gap-2.5 ${language === lang ? "bg-primary/10 font-semibold text-primary" : ""}`}
                  >
                    <span className="text-base">{languageFlags[lang]}</span>
                    {languageNames[lang]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground truncate max-w-[140px]">{user.email}</span>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-xs">
                  <LogOut className="w-3.5 h-3.5 mr-1.5" />
                  {t("signOut")}
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-xs">
                  <LogIn className="w-3.5 h-3.5 mr-1.5" />
                  {t("signIn")}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile: language + menu */}
          <div className="flex md:hidden items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-9" aria-label={t("language")}>
                  <span className="text-lg">{languageFlags[language]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[160px]">
                {(Object.keys(languageNames) as Language[]).map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`text-base py-3 cursor-pointer gap-3 ${language === lang ? "bg-primary/10 font-semibold text-primary" : ""}`}
                  >
                    <span className="text-lg">{languageFlags[lang]}</span>
                    {languageNames[lang]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-9" aria-label="Open menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-[320px] p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile sheet header */}
                  <div className="flex items-center gap-2.5 p-5 border-b border-border/40">
                    <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center">
                      <Shield className="w-4 h-4 text-card" />
                    </div>
                    <span className="font-display font-bold text-base">LassaGuard<span className="text-primary">AI</span></span>
                  </div>

                  {/* Mobile nav links */}
                  <nav className="flex flex-col p-3 gap-1" role="navigation" aria-label="Mobile navigation">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-base font-medium transition-all ${
                          isActive(link.href)
                            ? "bg-primary/10 text-primary shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary active:bg-secondary"
                        }`}
                        aria-current={isActive(link.href) ? "page" : undefined}
                      >
                        <link.icon className="w-5 h-5 flex-shrink-0" />
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile auth */}
                  <div className="mt-auto p-5 border-t border-border/40">
                    {user ? (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground text-center truncate">{user.email}</p>
                        <Button className="w-full h-12 text-base" variant="outline" onClick={handleSignOut}>
                          <LogOut className="w-4 h-4 mr-2" />
                          {t("signOut")}
                        </Button>
                      </div>
                    ) : (
                      <Link to="/login" onClick={() => setIsOpen(false)}>
                        <Button className="w-full h-12 text-base">
                          <LogIn className="w-4 h-4 mr-2" />
                          {t("signIn")} / {t("register")}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
