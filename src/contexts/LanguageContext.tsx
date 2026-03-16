import { createContext, useContext, useState, ReactNode } from "react";
import { Language, languageNames } from "@/types/riskChecker";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const uiTranslations: Record<string, Record<Language, string>> = {
  home: { en: "Home", fr: "Accueil", ha: "Gida", yo: "Ile", ig: "Ụlọ" },
  riskChecker: { en: "Risk Checker", fr: "Évaluation", ha: "Binciken Haɗari", yo: "Ayẹwo Ewu", ig: "Nyocha Ihe Egwu" },
  prevention: { en: "Prevention", fr: "Prévention", ha: "Kariya", yo: "Idena", ig: "Mgbochi" },
  about: { en: "About", fr: "À propos", ha: "Game da", yo: "Nipa", ig: "Maka" },
  signIn: { en: "Sign In", fr: "Connexion", ha: "Shiga", yo: "Wọle", ig: "Banye" },
  signOut: { en: "Sign Out", fr: "Déconnexion", ha: "Fita", yo: "Jade", ig: "Pụọ" },
  register: { en: "Register", fr: "S'inscrire", ha: "Yi rajista", yo: "Forúkọ sílẹ̀", ig: "Debanye aha" },
  checkYourRisk: { en: "Check Your Risk", fr: "Évaluez votre risque", ha: "Duba Haɗarinka", yo: "Ṣayẹwo Ewu Rẹ", ig: "Lelee Ihe Egwu Gị" },
  learnMore: { en: "Learn More", fr: "En savoir plus", ha: "Kara koyo", yo: "Kọ Diẹ Sii", ig: "Mụtakwuo" },
  heroTitle1: { en: "Protecting Nigeria from", fr: "Protéger le Nigéria contre", ha: "Kare Nijeriya daga", yo: "Abo Nàìjíríà lọwọ", ig: "Ichekwa Naịjirịa site na" },
  heroTitle2: { en: "Lassa Fever & Epidemic Diseases", fr: "la Fièvre de Lassa et les Épidémies", ha: "Cutar Lassa da Annoba", yo: "Iba Lassa ati Ajakale Arun", ig: "Ọrịa Lassa na Ọrịa Nnukwu" },
  heroDesc: {
    en: "AI-powered early risk detection, outbreak intelligence, and prevention support to protect Nigerian communities from Lassa fever and other epidemic diseases.",
    fr: "Détection précoce des risques alimentée par l'IA pour protéger les communautés nigérianes contre la fièvre de Lassa et d'autres épidémies.",
    ha: "Gano haɗarin da AI ke sarrafa don kare al'ummomin Nijeriya daga cutar Lassa da sauran annoba.",
    yo: "Ṣiṣe awari ewu ni kutukutu ti AI n ṣe lati daabo bo awọn agbegbe Nàìjíríà lọwọ Iba Lassa ati ajakale arun miiran.",
    ig: "Nchọpụta ihe egwu n'oge nke AI na-akwado iji chekwaa obodo Naịjirịa site na ọrịa Lassa na ọrịa nnukwu ndị ọzọ.",
  },
  developedBy: { en: "Developed by Matthew Falade, Omo Ilora", fr: "Développé par Matthew Falade, Omo Ilora", ha: "Wanda Matthew Falade, Omo Ilora ya ƙera", yo: "Ti Matthew Falade, Omo Ilora ṣe", ig: "Nke Matthew Falade, Omo Ilora mere" },
  nigeriansAtRisk: { en: "Nigerians at Risk", fr: "Nigérians à risque", ha: "Nijeriyawa cikin haɗari", yo: "Awọn ara Nàìjíríà ti o wa ninu ewu", ig: "Ndị Naịjirịa nọ n'ihe egwu" },
  statesMonitored: { en: "States Monitored", fr: "États surveillés", ha: "Jihohin da ake lura", yo: "Awọn ipinlẹ ti a n ṣe abojuto", ig: "Steeti a na-elekọta" },
  casesTracked: { en: "Cases Tracked Yearly", fr: "Cas suivis par an", ha: "Lokuta da ake bi sawu", yo: "Awọn ọran ti a n tọpa lọdọọdun", ig: "Okwu a na-enyocha kwa afọ" },
  featuresTitle: { en: "Protecting Nigeria from Epidemic Diseases", fr: "Protéger le Nigéria des maladies épidémiques", ha: "Kare Nijeriya daga cututtukan annoba", yo: "Abo Nàìjíríà lọwọ Ajakale Arun", ig: "Ichekwa Naịjirịa site na ọrịa nnukwu" },
  featuresDesc: {
    en: "Built for Nigerian communities, healthcare workers, and public health authorities — powered by ethical AI.",
    fr: "Conçu pour les communautés nigérianes, les soignants et les autorités sanitaires — alimenté par une IA éthique.",
    ha: "An gina shi don al'ummomin Nijeriya, ma'aikatan kiwon lafiya, da hukumomin kiwon lafiya — tare da AI mai ɗa'a.",
    yo: "Ti a kọ fun awọn agbegbe Nàìjíríà, awọn oṣiṣẹ ilera, ati awọn alaṣẹ ilera gbogbogbo — pẹlu AI ti o ni iwa.",
    ig: "Ewuru maka obodo Naịjirịa, ndị ọrụ ahụike, na ndị ọchịchị ahụike — site na AI kwesịrị ntụkwasị obi.",
  },
  sdgAligned: { en: "SDG 3 Aligned", fr: "Aligné ODD 3", ha: "Daidai da SDG 3", yo: "Ibamu pẹlu SDG 3", ig: "Dakọtara na SDG 3" },
  privacyFirst: { en: "Privacy-First", fr: "Confidentialité d'abord", ha: "Sirri da farko", yo: "Asiri ni akọkọ", ig: "Nzuzo bụ ụzọ" },
  aiPowered: { en: "AI-Powered", fr: "Alimenté par l'IA", ha: "AI ke sarrafa", yo: "AI n ṣe agbara", ig: "AI na-akwado" },
  language: { en: "Language", fr: "Langue", ha: "Harshe", yo: "Èdè", ig: "Asụsụ" },
  startHere: { en: "Start Here", fr: "Commencez ici", ha: "Fara nan", yo: "Bẹrẹ nibi", ig: "Bido ebe a" },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string) => {
    return uiTranslations[key]?.[language] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
