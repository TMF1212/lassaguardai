export interface Question {
  id: string;
  text: Record<string, string>;
  icon: string;
  options: { label: Record<string, string>; value: number }[];
}

export type RiskLevel = "low" | "medium" | "high";

export interface RiskResult {
  level: RiskLevel;
  score: number;
  message: Record<string, string>;
  action: Record<string, string>;
  explanation: string[];
  preventionTips: Record<string, string[]>;
}

export interface HealthcareFacility {
  name: string;
  type: string;
  distance: string;
  phone: string;
  address: string;
  website?: string;
}

export type Language = "en" | "fr" | "ha" | "yo" | "ig";

export const languageNames: Record<Language, string> = {
  en: "English",
  fr: "Français",
  ha: "Hausa",
  yo: "Yorùbá",
  ig: "Igbo",
};

export const translations: Record<string, Record<Language, string>> = {
  disclaimer: {
    en: "This tool does not provide medical diagnosis or treatment. Always consult a healthcare professional.",
    fr: "Cet outil ne fournit pas de diagnostic ou de traitement médical. Consultez toujours un professionnel de santé.",
    ha: "Wannan kayan aiki ba ya ba da ganewar asali ko magani. Koyaushe tuntuɓi ƙwararren likita.",
    yo: "Irinṣẹ yii ko pese ayẹwo tabi itọju iṣoogun. Kan si alamọdaju ilera nigbagbogbo.",
    ig: "Ngwá ọrụ a anaghị enye nchọpụta ma ọ bụ ọgwụgwọ ahụike. Jụọ onye ọkachamara ahụike mgbe niile.",
  },
  progress: {
    en: "Progress",
    fr: "Progrès",
    ha: "Ci gaba",
    yo: "Ilọsiwaju",
    ig: "Ọganihu",
  },
  question: {
    en: "Question",
    fr: "Question",
    ha: "Tambaya",
    yo: "Ibeere",
    ig: "Ajụjụ",
  },
  of: {
    en: "of",
    fr: "sur",
    ha: "daga",
    yo: "ninu",
    ig: "n'ime",
  },
  previous: {
    en: "Previous Question",
    fr: "Question précédente",
    ha: "Tambayar da ta gabata",
    yo: "Ibeere ti tẹlẹ",
    ig: "Ajụjụ gara aga",
  },
  restart: {
    en: "Start New Assessment",
    fr: "Nouvelle évaluation",
    ha: "Fara sabuwar kimantawa",
    yo: "Bẹrẹ igbelewọn tuntun",
    ig: "Malite nyocha ọhụrụ",
  },
  whyAssessment: {
    en: "Why this assessment:",
    fr: "Pourquoi cette évaluation :",
    ha: "Me yasa wannan kimantawa:",
    yo: "Idi fun igbelewọn yii:",
    ig: "Ihe mere nyocha a:",
  },
  nearbyFacilities: {
    en: "Nearby Healthcare Facilities",
    fr: "Établissements de santé à proximité",
    ha: "Cibiyoyin kiwon lafiya kusa",
    yo: "Awọn ile-iṣẹ ilera ti o wa nitosi",
    ig: "Ụlọ ahụike dị nso",
  },
  preventionTips: {
    en: "Prevention Tips",
    fr: "Conseils de prévention",
    ha: "Shawarwarin kariya",
    yo: "Awọn imọran idena",
    ig: "Ndụmọdụ mgbochi",
  },
  callEmergency: {
    en: "Call Emergency",
    fr: "Appeler les urgences",
    ha: "Kira gaggawa",
    yo: "Pe pajawiri",
    ig: "Kpọọ mberede",
  },
  getDirections: {
    en: "Get Directions",
    fr: "Obtenir l'itinéraire",
    ha: "Samu hanyoyi",
    yo: "Gba itọsọna",
    ig: "Nweta ntụziaka",
  },
};
