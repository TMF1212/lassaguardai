import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Info } from "lucide-react";
import { Question, RiskResult, Language, translations } from "@/types/riskChecker";
import LanguageSelector from "./LanguageSelector";
import RiskCheckerQuestion from "./RiskCheckerQuestion";
import RiskResultComponent from "./RiskResult";

const questions: Question[] = [
  {
    id: "fever",
    text: {
      en: "Do you have a fever (temperature above 38°C/100.4°F)?",
      fr: "Avez-vous de la fièvre (température supérieure à 38°C) ?",
      ha: "Kuna da zazzabi (zafin jiki sama da 38°C)?",
      yo: "Ṣe o ni iba (iwọn otutu ti o ju 38°C)?",
      ig: "Ị nwere ọkụ ahụ (okpomọkụ karịrị 38°C)?",
    },
    icon: "🌡️",
    options: [
      { label: { en: "No fever", fr: "Pas de fièvre", ha: "Babu zazzabi", yo: "Ko si iba", ig: "Enweghị ọkụ ahụ" }, value: 0 },
      { label: { en: "Mild fever", fr: "Fièvre légère", ha: "Zazzabi mai sauƙi", yo: "Iba kekere", ig: "Ọkụ ahụ nta" }, value: 1 },
      { label: { en: "High fever", fr: "Forte fièvre", ha: "Zazzabi mai tsanani", yo: "Iba giga", ig: "Ọkụ ahụ dị elu" }, value: 2 },
    ],
  },
  {
    id: "headache",
    text: {
      en: "Are you experiencing severe headache?",
      fr: "Avez-vous des maux de tête sévères ?",
      ha: "Kuna fama da ciwon kai mai tsanani?",
      yo: "Ṣe o ni orififo nla?",
      ig: "Ị na-enwe isi ọwụwa dị njọ?",
    },
    icon: "🤕",
    options: [
      { label: { en: "No headache", fr: "Pas de mal de tête", ha: "Babu ciwon kai", yo: "Ko si orififo", ig: "Enweghị isi ọwụwa" }, value: 0 },
      { label: { en: "Mild headache", fr: "Mal de tête léger", ha: "Ciwon kai mai sauƙi", yo: "Orififo kekere", ig: "Isi ọwụwa nta" }, value: 1 },
      { label: { en: "Severe headache", fr: "Mal de tête sévère", ha: "Ciwon kai mai tsanani", yo: "Orififo nla", ig: "Isi ọwụwa dị njọ" }, value: 2 },
    ],
  },
  {
    id: "bleeding",
    text: {
      en: "Any unusual bleeding (gums, nose, eyes)?",
      fr: "Saignements inhabituels (gencives, nez, yeux) ?",
      ha: "Akwai zubar jini ba daidai ba (ƙuƙumi, hanci, idanu)?",
      yo: "Ẹjẹ ti kii ṣe deede (ẹnu, imu, oju)?",
      ig: "Ọ nwere ọbara na-apụta apụta (eze, imi, anya)?",
    },
    icon: "🩸",
    options: [
      { label: { en: "No bleeding", fr: "Pas de saignement", ha: "Babu zubar jini", yo: "Ko si ẹjẹ", ig: "Enweghị ọbara" }, value: 0 },
      { label: { en: "Minor bleeding", fr: "Saignement mineur", ha: "Zubar jini kaɗan", yo: "Ẹjẹ kekere", ig: "Ọbara nta" }, value: 2 },
      { label: { en: "Significant bleeding", fr: "Saignement important", ha: "Zubar jini mai yawa", yo: "Ẹjẹ pupo", ig: "Ọbara dị ukwuu" }, value: 4 },
    ],
  },
  {
    id: "contact",
    text: {
      en: "Have you had contact with someone diagnosed with Lassa fever?",
      fr: "Avez-vous été en contact avec quelqu'un diagnostiqué avec la fièvre de Lassa ?",
      ha: "Kun yi hulɗa da wanda aka gano yana da cutar Lassa?",
      yo: "Ṣe o ti ṣe pẹlu ẹnikan ti o ni iba Lassa?",
      ig: "Ị nwere nkwurịta oku na onye a chọpụtara na ọ nwere ọrịa Lassa?",
    },
    icon: "👥",
    options: [
      { label: { en: "No contact", fr: "Pas de contact", ha: "Babu hulɗa", yo: "Ko si asopọ", ig: "Enweghị nkwurịta" }, value: 0 },
      { label: { en: "Unsure", fr: "Incertain", ha: "Ban tabbata ba", yo: "Mi ko da", ig: "Amaghị m" }, value: 1 },
      { label: { en: "Yes, confirmed contact", fr: "Oui, contact confirmé", ha: "Ee, hulɗa tabbatacciya", yo: "Bẹẹni, asopọ ti a fọwọsi", ig: "Ee, nkwurịta agọziiri" }, value: 3 },
    ],
  },
  {
    id: "rodents",
    text: {
      en: "Have you had exposure to rodents or their droppings?",
      fr: "Avez-vous été exposé à des rongeurs ou leurs excréments ?",
      ha: "Kun yi hulɗa da beraye ko ƙashinsu?",
      yo: "Ṣe o ti farahan si awọn eku tabi igbẹ wọn?",
      ig: "Ị nwetụla mmekọrịta na oke ma ọ bụ nsị ha?",
    },
    icon: "🐀",
    options: [
      { label: { en: "No exposure", fr: "Pas d'exposition", ha: "Babu hulɗa", yo: "Ko si ifihan", ig: "Enweghị mmekọrịta" }, value: 0 },
      { label: { en: "Possibly exposed", fr: "Peut-être exposé", ha: "Mai yiwuwa an fallasa", yo: "Boya mo farahan", ig: "Enwere ike" }, value: 1 },
      { label: { en: "Yes, direct exposure", fr: "Oui, exposition directe", ha: "Ee, fallasa kai tsaye", yo: "Bẹẹni, ifihan taara", ig: "Ee, mmekọrịta kpọmkwem" }, value: 2 },
    ],
  },
  {
    id: "travel",
    text: {
      en: "Have you traveled to a Lassa fever endemic area in the past 21 days?",
      fr: "Avez-vous voyagé dans une zone endémique de la fièvre de Lassa au cours des 21 derniers jours ?",
      ha: "Kun yi tafiya zuwa yankin da cutar Lassa ke yaɗuwa a cikin kwanaki 21 da suka gabata?",
      yo: "Ṣe o ti rin irin-ajo lọ si agbegbe ti iba Lassa n gbilẹ ni ọjọ 21 sẹhin?",
      ig: "Ị gara njem gaa ebe ọrịa Lassa na-efe efe n'ụbọchị 21 gara aga?",
    },
    icon: "✈️",
    options: [
      { label: { en: "No travel", fr: "Pas de voyage", ha: "Babu tafiya", yo: "Ko si irin-ajo", ig: "Enweghị njem" }, value: 0 },
      { label: { en: "Traveled to nearby region", fr: "Voyagé dans une région voisine", ha: "Tafiya zuwa yanki kusa", yo: "Rin irin-ajo lọ si agbegbe ti o wa nitosi", ig: "Gara mpaghara dị nso" }, value: 1 },
      { label: { en: "Traveled to endemic area", fr: "Voyagé en zone endémique", ha: "Tafiya zuwa yankin yaɗuwar cuta", yo: "Rin irin-ajo lọ si agbegbe ti o n gbilẹ", ig: "Gara ebe na-efe efe" }, value: 2 },
    ],
  },
];

const getRiskResult = (answers: Record<string, number>): RiskResult => {
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
  const maxScore = 15;
  const percentage = (totalScore / maxScore) * 100;

  const explanation: string[] = [];
  if (answers.fever > 0) explanation.push("Fever detected as a symptom");
  if (answers.headache > 0) explanation.push("Headache symptoms reported");
  if (answers.bleeding > 0) explanation.push("Bleeding symptoms reported");
  if (answers.contact > 0) explanation.push("Potential contact exposure");
  if (answers.rodents > 0) explanation.push("Rodent exposure risk factor");
  if (answers.travel > 0) explanation.push("Travel to endemic area");

  const preventionTips = {
    en: [
      "Store food in rodent-proof containers",
      "Keep your home clean and free of rodents",
      "Avoid contact with sick persons' body fluids",
      "Wash hands frequently with soap and water",
      "Cook food thoroughly before eating",
    ],
    fr: [
      "Stockez les aliments dans des contenants résistants aux rongeurs",
      "Gardez votre maison propre et sans rongeurs",
      "Évitez le contact avec les fluides corporels des personnes malades",
      "Lavez-vous les mains fréquemment avec du savon et de l'eau",
      "Cuisez bien les aliments avant de les manger",
    ],
    ha: [
      "Adana abinci a cikin kwalabe masu kariya daga beraye",
      "Ka kiyaye gidanka da tsabta ba tare da beraye ba",
      "Ka guji hulɗa da ruwan jikin marasa lafiya",
      "Ka wanke hannunka akai-akai da sabulu da ruwa",
      "Ka dafa abinci sosai kafin ci",
    ],
    yo: [
      "Fi ounjẹ pamọ ninu awọn apoti ti eku ko le wọ",
      "Pa ile rẹ mọ ki eku ma ba si",
      "Yago fun fọwọkan omi ara awọn alaisan",
      "Wẹ ọwọ rẹ nigbagbogbo pẹlu ọṣẹ ati omi",
      "Se ounjẹ daradara ki o to jẹ",
    ],
    ig: [
      "Chekwaa nri n'ime ihe ndị oke na-apụghị ibanye",
      "Debe ụlọ gị ọcha ma oke anọghị",
      "Zere imetụ mmiri ahụ ndị ọrịa aka",
      "Saa aka gị mgbe mgbe na ncha na mmiri",
      "Sie nri nke ọma tupu iri",
    ],
  };

  if (percentage >= 60 || answers.bleeding >= 2) {
    return {
      level: "high",
      score: totalScore,
      message: {
        en: "High Risk - Seek Immediate Medical Attention",
        fr: "Risque élevé - Consultez immédiatement un médecin",
        ha: "Haɗari mai girma - Nemi kulawar likita nan take",
        yo: "Ewu giga - Wa itọju ilera lẹsẹkẹsẹ",
        ig: "Ihe egwu dị elu - Chọọ nlekọta ahụike ozugbo",
      },
      action: {
        en: "Please go to the nearest healthcare facility immediately. Inform them of your symptoms and exposure history.",
        fr: "Veuillez vous rendre immédiatement dans l'établissement de santé le plus proche. Informez-les de vos symptômes et de votre historique d'exposition.",
        ha: "Da fatan za a je cibiyar kiwon lafiya mafi kusa nan take. Sanar da su game da alamunku da tarihin fallasarku.",
        yo: "Jọwọ lọ si ile-iṣẹ ilera ti o sunmọ julọ lẹsẹkẹsẹ. Sọ fun wọn nipa awọn aami aisan ati itan ifihan rẹ.",
        ig: "Biko gaa ụlọ ahụike kacha nso ozugbo. Gwa ha maka ihe mgbaàmà na akụkọ mmekọrịta gị.",
      },
      explanation: explanation.length > 0 ? explanation : ["Multiple risk factors identified"],
      preventionTips,
    };
  } else if (percentage >= 30) {
    return {
      level: "medium",
      score: totalScore,
      message: {
        en: "Medium Risk - Medical Consultation Recommended",
        fr: "Risque modéré - Consultation médicale recommandée",
        ha: "Haɗari na matsakaici - Ana ba da shawarar tuntuɓar likita",
        yo: "Ewu alabọde - Ijumọsọrọ pẹlu dokita ni a ṣe iṣeduro",
        ig: "Ihe egwu dị n'etiti - A na-akwado ịhụ dọkịta",
      },
      action: {
        en: "Self-isolate and contact a healthcare provider within 24 hours. Monitor your symptoms closely.",
        fr: "Isolez-vous et contactez un professionnel de santé dans les 24 heures. Surveillez vos symptômes de près.",
        ha: "Ku ware kanku kuma ku tuntuɓi ma'aikacin kiwon lafiya cikin awanni 24. Ku kula da alamunku sosai.",
        yo: "Ya ara rẹ sọtọ ki o si kan si olupese ilera laarin wakati 24. Ṣọra si awọn aami aisan rẹ.",
        ig: "Wepụ onwe gị ma kpọtụrụ onye na-enye ọrụ ahụike n'ime awa 24. Lekwasị anya ihe mgbaàmà gị nke ọma.",
      },
      explanation: explanation.length > 0 ? explanation : ["Some risk factors present"],
      preventionTips,
    };
  } else {
    return {
      level: "low",
      score: totalScore,
      message: {
        en: "Low Risk - Continue Monitoring",
        fr: "Risque faible - Continuez à surveiller",
        ha: "Ƙaramin haɗari - Ci gaba da kula",
        yo: "Ewu kekere - Tẹsiwaju lati ṣọra",
        ig: "Ihe egwu dị ntakịrị - Gaa n'ihu na-elele",
      },
      action: {
        en: "Continue to practice good hygiene. Monitor for any new symptoms over the next 7-14 days.",
        fr: "Continuez à pratiquer une bonne hygiène. Surveillez tout nouveau symptôme au cours des 7 à 14 prochains jours.",
        ha: "Ci gaba da yin tsafta mai kyau. Ku kula da duk wata sabuwar alamar cikin kwanaki 7-14 masu zuwa.",
        yo: "Tẹsiwaju lati ṣe imọtoto to dara. Ṣọra fun awọn aami aisan tuntun eyikeyi ni ọjọ 7-14 ti n bọ.",
        ig: "Gaa n'ihu ịdị ọcha nke ọma. Lekwasị anya ihe mgbaàmà ọhụrụ ọ bụla n'ụbọchị 7-14 na-esote.",
      },
      explanation: explanation.length > 0 ? explanation : ["No significant risk factors identified"],
      preventionTips,
    };
  }
};

const RiskChecker = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [language, setLanguage] = useState<Language>("en");

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
  };

  const progress = ((currentQuestion + (showResult ? 1 : 0)) / questions.length) * 100;
  const result = showResult ? getRiskResult(answers) : null;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Language Selector */}
      <div className="flex justify-end mb-4">
        <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
      </div>

      {/* Disclaimer */}
      <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">⚠️ {language === "en" ? "Important" : language === "fr" ? "Important" : "Muhimmi"}:</strong>{" "}
            {translations.disclaimer[language]}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-base text-muted-foreground mb-2">
          <span className="font-medium">{translations.progress[language]}</span>
          <span className="font-bold">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      {/* Question or Result */}
      {!showResult ? (
        <RiskCheckerQuestion
          question={questions[currentQuestion]}
          currentIndex={currentQuestion}
          totalQuestions={questions.length}
          language={language}
          onAnswer={handleAnswer}
          onBack={handleBack}
          canGoBack={currentQuestion > 0}
        />
      ) : result && (
        <RiskResultComponent
          result={result}
          language={language}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default RiskChecker;
