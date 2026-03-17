import { Card, CardContent } from "@/components/ui/card";
import { Activity, Shield, MapPin, Users, Brain, Lock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/types/riskChecker";
import { motion } from "framer-motion";

const featureData: { icon: typeof Brain; titleKey: string; descKey: string; color: string }[] = [
  { icon: Brain, titleKey: "aiRisk", descKey: "aiRiskDesc", color: "bg-primary/10 text-primary" },
  { icon: MapPin, titleKey: "outbreak", descKey: "outbreakDesc", color: "bg-accent/10 text-accent" },
  { icon: Shield, titleKey: "prevEd", descKey: "prevEdDesc", color: "bg-success/10 text-success" },
  { icon: Users, titleKey: "hcSupport", descKey: "hcSupportDesc", color: "bg-warning/10 text-warning" },
  { icon: Activity, titleKey: "earlyWarn", descKey: "earlyWarnDesc", color: "bg-primary/10 text-primary" },
  { icon: Lock, titleKey: "privacy", descKey: "privacyDesc", color: "bg-accent/10 text-accent" },
];

const texts: Record<string, Record<Language, string>> = {
  aiRisk: { en: "AI Risk Assessment", fr: "Évaluation IA des risques", ha: "Kimantawar Haɗari ta AI", yo: "Igbelewọn Ewu AI", ig: "Nyocha Ihe Egwu AI" },
  aiRiskDesc: { en: "Non-diagnostic symptom and exposure checker powered by responsible AI for early risk stratification.", fr: "Vérificateur de symptômes non diagnostique alimenté par une IA responsable.", ha: "Mai binciken alamomi da fallasa da AI mai adalci ke sarrafa.", yo: "Ayẹwo awọn aami aisan ti kii ṣe iwadii ti AI lodidi n ṣe agbara.", ig: "Nyocha ihe mgbaàmà na-abụghị nchọpụta nke AI kwesịrị ntụkwasị obi na-akwado." },
  outbreak: { en: "Outbreak Intelligence", fr: "Veille épidémiologique", ha: "Hankali kan barkewar cuta", yo: "Oye Ibesile", ig: "Ọgụgụ isi mmalite ọrịa" },
  outbreakDesc: { en: "Real-time geographic heat maps and trend detection for public health authorities.", fr: "Cartes thermiques géographiques en temps réel et détection de tendances.", ha: "Taswirar zafi na yanki da gano yanayi a lokacin da ake bukata.", yo: "Awọn maapu igbona agbegbe ati iwari aṣa ni akoko gidi.", ig: "Maapụ okpomọkụ mpaghara na nchọpụta ụdị n'oge ezigbo." },
  prevEd: { en: "Prevention Education", fr: "Éducation préventive", ha: "Ilimin Kariya", yo: "Ẹkọ Idena", ig: "Agụmakwụkwọ Mgbochi" },
  prevEdDesc: { en: "Multilingual, accessible health education resources tailored to local contexts.", fr: "Ressources d'éducation sanitaire multilingues et accessibles.", ha: "Albarkatun ilimin kiwon lafiya na harsuna da yawa.", yo: "Awọn orisun ẹkọ ilera ti o wa ni ọpọlọpọ ede.", ig: "Ihe ọmụmụ ahụike n'asụsụ dị iche iche." },
  hcSupport: { en: "Healthcare Support", fr: "Soutien aux soignants", ha: "Tallafin Kiwon Lafiya", yo: "Atilẹyin Ilera", ig: "Nkwado Ahụike" },
  hcSupportDesc: { en: "Case tracking dashboards and WHO/CDC-aligned clinical guidance for healthcare workers.", fr: "Tableaux de bord de suivi et orientation clinique alignée OMS/CDC.", ha: "Dashbod na bin sawu da jagorar asibiti daidai da WHO/CDC.", yo: "Dashboards atọpa ati itọsọna ile-iwosan ti o baamu WHO/CDC.", ig: "Dashboards na-eso ụzọ na nduzi ahụike kwekọrọ na WHO/CDC." },
  earlyWarn: { en: "Early Warning System", fr: "Système d'alerte précoce", ha: "Tsarin Gargaɗi Na Wuri", yo: "Eto Ikilo Ni Kutukutu", ig: "Usoro Ịdọ Aka Na Ntị N'oge" },
  earlyWarnDesc: { en: "Pattern detection algorithms to identify potential outbreaks before they spread.", fr: "Algorithmes de détection pour identifier les flambées avant propagation.", ha: "Dabaru don gano yiwuwar barkewar cuta kafin yaɗuwa.", yo: "Awọn algorithm lati ṣe idanimọ ibesile ṣaaju ki o tan.", ig: "Algorithm iji chọpụta mmalite ọrịa tupu ọ gbasaa." },
  privacy: { en: "Privacy-First Design", fr: "Confidentialité d'abord", ha: "Sirri da farko", yo: "Aṣa Asiri ni Akọkọ", ig: "Nhazi Nzuzo Bụ Ụzọ" },
  privacyDesc: { en: "GDPR/HIPAA-ready architecture with data anonymization and user consent by default.", fr: "Architecture prête RGPD/HIPAA avec anonymisation et consentement.", ha: "Tsarin gine-gine mai shirye-shiryen GDPR/HIPAA.", yo: "Ayaworan GDPR/HIPAA pẹlu ìfipamọ́ data.", ig: "Ihe owuwu GDPR/HIPAA jikere na nzuzo data." },
};

const Features = () => {
  const { language, t } = useLanguage();

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-3 md:mb-4">
            {t("featuresTitle")}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("featuresDesc")}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {featureData.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Card className="group hover:shadow-md transition-all duration-300 border-border/40 rounded-xl h-full">
                <CardContent className="p-5 md:p-6">
                  <div className={`w-11 h-11 md:w-12 md:h-12 rounded-xl ${feature.color} flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold font-display mb-2">{texts[feature.titleKey][language]}</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{texts[feature.descKey][language]}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
