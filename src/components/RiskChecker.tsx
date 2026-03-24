import { useState, useMemo, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Info } from "lucide-react";
import { Question, RiskResult, Language, translations } from "@/types/riskChecker";
import RiskCheckerQuestion from "./RiskCheckerQuestion";
import RiskResultComponent from "./RiskResult";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

// Base questions always shown
const baseQuestions: Question[] = [
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
    id: "sore_throat",
    text: {
      en: "Do you have a sore throat or difficulty swallowing?",
      fr: "Avez-vous mal à la gorge ou des difficultés à avaler ?",
      ha: "Kuna da ciwon makogwaro ko wahalar hadiya?",
      yo: "Ṣe ọfun rẹ n dun ọ tabi o nira lati gbemú?",
      ig: "Ị nwere mgbu akpịrị ma ọ bụ nsogbu ịlọ nri?",
    },
    icon: "🤒",
    options: [
      { label: { en: "No sore throat", fr: "Pas de mal de gorge", ha: "Babu ciwon makogwaro", yo: "Ko si ọfun didun", ig: "Enweghị mgbu akpịrị" }, value: 0 },
      { label: { en: "Mild sore throat", fr: "Mal de gorge léger", ha: "Ciwon makogwaro mai sauƙi", yo: "Ọfun didun kekere", ig: "Mgbu akpịrị nta" }, value: 1 },
      { label: { en: "Severe / can't swallow", fr: "Sévère / ne peut pas avaler", ha: "Mai tsanani / ba zai iya hadiya ba", yo: "Nla / ko le gbemú", ig: "Dị njọ / apụghị ịlọ nri" }, value: 2 },
    ],
  },
  {
    id: "chest_pain",
    text: {
      en: "Are you experiencing chest pain or difficulty breathing?",
      fr: "Ressentez-vous des douleurs thoraciques ou des difficultés respiratoires ?",
      ha: "Kuna jin ciwon ƙirji ko wahalar numfashi?",
      yo: "Ṣe àyà rẹ n dun ọ tabi o nira lati mí?",
      ig: "Ị na-enwe mgbu obi ma ọ bụ nsogbu iku ume?",
    },
    icon: "💨",
    options: [
      { label: { en: "No chest issues", fr: "Pas de problèmes thoraciques", ha: "Babu matsalar ƙirji", yo: "Ko si isoro àyà", ig: "Enweghị nsogbu obi" }, value: 0 },
      { label: { en: "Mild discomfort", fr: "Gêne légère", ha: "Rashin jin daɗi mai sauƙi", yo: "Aibalẹ kekere", ig: "Enweghị ntọala nta" }, value: 1 },
      { label: { en: "Severe pain / shortness of breath", fr: "Douleur sévère / essoufflement", ha: "Ciwo mai tsanani / ƙarancin numfashi", yo: "Irora nla / ẹmi kukuru", ig: "Mgbu dị njọ / ume na-akụ" }, value: 3 },
    ],
  },
  {
    id: "weakness",
    text: {
      en: "Are you experiencing unusual fatigue or weakness?",
      fr: "Ressentez-vous une fatigue ou une faiblesse inhabituelle ?",
      ha: "Kuna jin gajiya ko rashin ƙarfi ba daidai ba?",
      yo: "Ṣe o ni aarẹ tabi ailagbara ti kii ṣe deede?",
      ig: "Ị na-enwe ike gwụrụ ma ọ bụ adịghị ike pụrụ iche?",
    },
    icon: "😩",
    options: [
      { label: { en: "Normal energy", fr: "Énergie normale", ha: "Ƙarfi na al'ada", yo: "Agbara deede", ig: "Ike dị mma" }, value: 0 },
      { label: { en: "More tired than usual", fr: "Plus fatigué que d'habitude", ha: "Gajiya fiye da al'ada", yo: "Aarẹ ju deede lọ", ig: "Ike gwụrụ karịa" }, value: 1 },
      { label: { en: "Extreme weakness / can't stand", fr: "Faiblesse extrême / ne peut pas se lever", ha: "Rashin ƙarfi mai tsanani", yo: "Ailagbara pupọ / ko le dide", ig: "Adịghị ike kpamkpam" }, value: 2 },
    ],
  },
  {
    id: "facial_swelling",
    text: {
      en: "Do you have any facial swelling or swollen lymph nodes?",
      fr: "Avez-vous un gonflement du visage ou des ganglions lymphatiques enflés ?",
      ha: "Kuna da kumburin fuska ko kumburin ƙwayoyin lymph?",
      yo: "Ṣe oju rẹ wú tabi awọn keekeke lymph rẹ wú?",
      ig: "Ị nwere otu ahụ na-aza ma ọ bụ lymph na-aza?",
    },
    icon: "😷",
    options: [
      { label: { en: "No swelling", fr: "Pas de gonflement", ha: "Babu kumburi", yo: "Ko si wiwu", ig: "Enweghị otu" }, value: 0 },
      { label: { en: "Mild swelling", fr: "Gonflement léger", ha: "Kumburi mai sauƙi", yo: "Wiwu kekere", ig: "Otu nta" }, value: 1 },
      { label: { en: "Significant swelling", fr: "Gonflement important", ha: "Kumburi mai girma", yo: "Wiwu nla", ig: "Otu dị ukwuu" }, value: 3 },
    ],
  },
];

// Conditional follow-up questions triggered by previous answers
const conditionalQuestions: (Question & { condition: (answers: Record<string, number>) => boolean })[] = [
  {
    id: "fever_duration",
    condition: (answers) => (answers.fever ?? 0) >= 1,
    text: {
      en: "How long have you had the fever?",
      fr: "Depuis combien de temps avez-vous de la fièvre ?",
      ha: "Tun yaushe kuke da zazzabi?",
      yo: "Igba wo ni o ti ni iba?",
      ig: "Ogologo oge ole ka ị nwere ọkụ ahụ?",
    },
    icon: "⏱️",
    options: [
      { label: { en: "Less than 2 days", fr: "Moins de 2 jours", ha: "Ƙasa da kwana 2", yo: "Kere ju ọjọ 2", ig: "Ihe na-erughị ụbọchị 2" }, value: 0 },
      { label: { en: "2–7 days", fr: "2 à 7 jours", ha: "Kwana 2–7", yo: "Ọjọ 2–7", ig: "Ụbọchị 2–7" }, value: 1 },
      { label: { en: "More than 7 days", fr: "Plus de 7 jours", ha: "Fiye da kwana 7", yo: "Ju ọjọ 7 lọ", ig: "Karịa ụbọchị 7" }, value: 2 },
    ],
  },
  {
    id: "body_pain",
    condition: (answers) => (answers.fever ?? 0) >= 1 || (answers.headache ?? 0) >= 1,
    text: {
      en: "Are you experiencing muscle or joint pain?",
      fr: "Ressentez-vous des douleurs musculaires ou articulaires ?",
      ha: "Kuna jin ciwo a tsokoki ko gaɓoɓin jikinku?",
      yo: "Ṣe o ni irora iṣan tabi isẹpo?",
      ig: "Ị na-enwe mgbu akwara ma ọ bụ nkwonkwo?",
    },
    icon: "💪",
    options: [
      { label: { en: "No pain", fr: "Pas de douleur", ha: "Babu ciwo", yo: "Ko si irora", ig: "Enweghị mgbu" }, value: 0 },
      { label: { en: "Mild aches", fr: "Douleurs légères", ha: "Ciwo mai sauƙi", yo: "Irora kekere", ig: "Mgbu nta" }, value: 1 },
      { label: { en: "Severe pain", fr: "Douleur sévère", ha: "Ciwo mai tsanani", yo: "Irora nla", ig: "Mgbu dị njọ" }, value: 2 },
    ],
  },
  {
    id: "bleeding_detail",
    condition: (answers) => (answers.bleeding ?? 0) >= 2,
    text: {
      en: "Where exactly is the bleeding occurring?",
      fr: "Où exactement le saignement se produit-il ?",
      ha: "A ina zubar jinin ke faruwa?",
      yo: "Nibo ni ẹjẹ naa ti n jade?",
      ig: "Ebee ka ọbara ahụ si apụta?",
    },
    icon: "🏥",
    options: [
      { label: { en: "Gums only", fr: "Gencives uniquement", ha: "Ƙuƙumi kaɗai", yo: "Ẹnu nikan", ig: "Eze naanị" }, value: 1 },
      { label: { en: "Nose or eyes", fr: "Nez ou yeux", ha: "Hanci ko idanu", yo: "Imu tabi oju", ig: "Imi ma ọ bụ anya" }, value: 2 },
      { label: { en: "Multiple sites or internal", fr: "Plusieurs sites ou interne", ha: "Wurare da yawa ko na ciki", yo: "Ọpọ aaye tabi inu", ig: "Ọtụtụ ebe ma ọ bụ n'ime" }, value: 4 },
    ],
  },
  {
    id: "vomiting",
    condition: (answers) => (answers.fever ?? 0) >= 1 && (answers.headache ?? 0) >= 1,
    text: {
      en: "Are you experiencing vomiting or diarrhea?",
      fr: "Avez-vous des vomissements ou de la diarrhée ?",
      ha: "Kuna amai ko gudawa?",
      yo: "Ṣe o ni eebi tabi igbẹ gbuuru?",
      ig: "Ị na-agbọ ọgwụgwọ ma ọ bụ afọ ọsịsa?",
    },
    icon: "🤢",
    options: [
      { label: { en: "Neither", fr: "Aucun", ha: "Babu ɗaya", yo: "Ko si ẹnikan", ig: "Ọ dịghị nke ọ bụla" }, value: 0 },
      { label: { en: "Mild nausea or loose stool", fr: "Nausées légères ou selles molles", ha: "Tashin zuciya ko gudawa mai sauƙi", yo: "Ríru kekere tabi igbẹ rirọ", ig: "Oyi afọ ma ọ bụ afọ ọsịsa nta" }, value: 1 },
      { label: { en: "Frequent vomiting or severe diarrhea", fr: "Vomissements fréquents ou diarrhée sévère", ha: "Amai da yawa ko gudawa mai tsanani", yo: "Eebi pupọ tabi igbẹ gbuuru nla", ig: "Ọgbụgbọ ọgwụgwọ ma ọ bụ afọ ọsịsa dị njọ" }, value: 3 },
    ],
  },
];

// Exposure questions always shown
const exposureQuestions: Question[] = [
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

// Conditional exposure follow-up
const conditionalExposureQuestions: (Question & { condition: (answers: Record<string, number>) => boolean })[] = [
  {
    id: "contact_type",
    condition: (answers) => (answers.contact ?? 0) >= 1,
    text: {
      en: "What type of contact did you have?",
      fr: "Quel type de contact avez-vous eu ?",
      ha: "Wane irin hulɗa kuka yi?",
      yo: "Iru asopọ wo ni o ni?",
      ig: "Ụdị nkwurịta ole ka ị nwere?",
    },
    icon: "🤝",
    options: [
      { label: { en: "Same household only", fr: "Même ménage uniquement", ha: "Gida ɗaya kawai", yo: "Ile kanna nikan", ig: "Otu ụlọ naanị" }, value: 1 },
      { label: { en: "Touched or shared items", fr: "Touché ou partagé des objets", ha: "Taɓa ko raba kayayyaki", yo: "Fi ọwọ kan tabi pin ohun", ig: "Metụrụ aka ma ọ bụ kere ihe" }, value: 2 },
      { label: { en: "Direct contact with body fluids", fr: "Contact direct avec les fluides corporels", ha: "Hulɗa kai tsaye da ruwan jiki", yo: "Ifọwọkan taara pẹlu omi ara", ig: "Nkwurịta kpọmkwem na mmiri ahụ" }, value: 4 },
    ],
  },
  {
    id: "food_source",
    condition: (answers) => (answers.rodents ?? 0) >= 1,
    text: {
      en: "Have you eaten food that may have been contaminated by rodents?",
      fr: "Avez-vous mangé des aliments pouvant avoir été contaminés par des rongeurs ?",
      ha: "Kun ci abincin da beraye za su iya gurɓata?",
      yo: "Ṣe o ti jẹ ounjẹ ti eku le ti ba jẹ?",
      ig: "Ị riela nri nke oke nwere ike ịmerụ?",
    },
    icon: "🍽️",
    options: [
      { label: { en: "No / Unsure", fr: "Non / Incertain", ha: "A'a / Ban sani ba", yo: "Rara / Mi ko da", ig: "Mba / Amaghị" }, value: 0 },
      { label: { en: "Possibly", fr: "Peut-être", ha: "Mai yiwuwa", yo: "Boya", ig: "Enwere ike" }, value: 1 },
      { label: { en: "Yes, likely contaminated food", fr: "Oui, nourriture probablement contaminée", ha: "Ee, abinci mai yiwuwa gurɓatacce", yo: "Bẹẹni, ounjẹ ti o ṣee ṣe ki eku ti ba jẹ", ig: "Ee, nri enwere ike ịmerụ" }, value: 2 },
    ],
  },
];

// Factor labels for result explanation
const factorLabels: Record<string, Record<Language, string>> = {
  fever: {
    en: "Fever reported",
    fr: "Fièvre signalée",
    ha: "An ba da rahoton zazzabi",
    yo: "Iba ti a royin",
    ig: "Ekwuru ọkụ ahụ",
  },
  fever_duration: {
    en: "Prolonged fever duration",
    fr: "Durée prolongée de la fièvre",
    ha: "Tsawon lokacin zazzabi",
    yo: "Akoko iba ti o gun",
    ig: "Ogologo oge ọkụ ahụ",
  },
  headache: {
    en: "Headache symptoms",
    fr: "Symptômes de maux de tête",
    ha: "Alamun ciwon kai",
    yo: "Awọn aami aisan orififo",
    ig: "Ihe mgbaàmà isi ọwụwa",
  },
  body_pain: {
    en: "Muscle or joint pain",
    fr: "Douleurs musculaires ou articulaires",
    ha: "Ciwon tsoka ko gaɓoɓi",
    yo: "Irora iṣan tabi isẹpo",
    ig: "Mgbu akwara ma ọ bụ nkwonkwo",
  },
  bleeding: {
    en: "Unusual bleeding detected",
    fr: "Saignement inhabituel détecté",
    ha: "An gano zubar jini maras al'ada",
    yo: "Ẹjẹ ajeji ti a rii",
    ig: "Achọpụtara ọbara na-apụta apụta",
  },
  bleeding_detail: {
    en: "Bleeding from multiple sites",
    fr: "Saignement de plusieurs sites",
    ha: "Zubar jini daga wurare da yawa",
    yo: "Ẹjẹ lati ọpọ aaye",
    ig: "Ọbara si ọtụtụ ebe",
  },
  vomiting: {
    en: "Vomiting or diarrhea present",
    fr: "Vomissements ou diarrhée présents",
    ha: "Akwai amai ko gudawa",
    yo: "Eebi tabi igbẹ gbuuru wa",
    ig: "Ọgbụgbọ ọgwụgwọ ma ọ bụ afọ ọsịsa dị",
  },
  contact: {
    en: "Contact with suspected/confirmed case",
    fr: "Contact avec un cas suspect/confirmé",
    ha: "Hulɗa da wanda ake zargi/tabbatar",
    yo: "Asopọ pẹlu ọran ti a fura/fọwọsi",
    ig: "Nkwurịta na onye a na-enyo/kwadoro",
  },
  contact_type: {
    en: "High-risk type of contact",
    fr: "Type de contact à haut risque",
    ha: "Irin hulɗa mai haɗari",
    yo: "Iru asopọ ewu giga",
    ig: "Ụdị nkwurịta ihe egwu dị elu",
  },
  rodents: {
    en: "Rodent exposure reported",
    fr: "Exposition aux rongeurs signalée",
    ha: "An ba da rahoton fallasa beraye",
    yo: "Ifihan si eku ti a royin",
    ig: "Ekwuru mmekọrịta oke",
  },
  food_source: {
    en: "Potentially contaminated food consumed",
    fr: "Consommation d'aliments potentiellement contaminés",
    ha: "An ci abinci mai yiwuwa gurɓatacce",
    yo: "Ounjẹ ti o ṣee ṣe ki o ti bajẹ",
    ig: "Oriri nri nwere ike ịmerụ",
  },
  travel: {
    en: "Travel to endemic area",
    fr: "Voyage en zone endémique",
    ha: "Tafiya zuwa yankin yaɗuwar cuta",
    yo: "Irin-ajo lọ si agbegbe ti o n gbilẹ",
    ig: "Njem gaa ebe na-efe efe",
  },
  sore_throat: {
    en: "Sore throat reported",
    fr: "Mal de gorge signalé",
    ha: "An ba da rahoton ciwon makogwaro",
    yo: "Ọfun didun ti a royin",
    ig: "Ekwuru mgbu akpịrị",
  },
  chest_pain: {
    en: "Chest pain or breathing difficulty",
    fr: "Douleur thoracique ou difficulté respiratoire",
    ha: "Ciwon ƙirji ko wahalar numfashi",
    yo: "Irora àyà tabi iṣoro mimi",
    ig: "Mgbu obi ma ọ bụ nsogbu iku ume",
  },
  weakness: {
    en: "Unusual fatigue or weakness",
    fr: "Fatigue ou faiblesse inhabituelle",
    ha: "Gajiya ko rashin ƙarfi ba daidai ba",
    yo: "Aarẹ tabi ailagbara ajeji",
    ig: "Ike gwụrụ ma ọ bụ adịghị ike pụrụ iche",
  },
  facial_swelling: {
    en: "Facial or lymph node swelling",
    fr: "Gonflement du visage ou des ganglions",
    ha: "Kumburin fuska ko ƙwayoyin lymph",
    yo: "Wiwu oju tabi keekeke lymph",
    ig: "Otu ihu ma ọ bụ lymph",
  },
};

const factorSeverity: Record<string, (value: number) => "none" | "mild" | "severe"> = {
  fever: (v) => v === 0 ? "none" : v === 1 ? "mild" : "severe",
  fever_duration: (v) => v === 0 ? "none" : v === 1 ? "mild" : "severe",
  headache: (v) => v === 0 ? "none" : v === 1 ? "mild" : "severe",
  body_pain: (v) => v === 0 ? "none" : v === 1 ? "mild" : "severe",
  bleeding: (v) => v === 0 ? "none" : v <= 2 ? "mild" : "severe",
  bleeding_detail: (v) => v <= 1 ? "mild" : "severe",
  vomiting: (v) => v === 0 ? "none" : v === 1 ? "mild" : "severe",
  contact: (v) => v === 0 ? "none" : v === 1 ? "mild" : "severe",
  contact_type: (v) => v <= 1 ? "mild" : "severe",
  rodents: (v) => v === 0 ? "none" : v === 1 ? "mild" : "severe",
  food_source: (v) => v === 0 ? "none" : v === 1 ? "mild" : "severe",
  travel: (v) => v === 0 ? "none" : v === 1 ? "mild" : "severe",
  sore_throat: (v) => v === 0 ? "none" : v === 1 ? "mild" : "severe",
  chest_pain: (v) => v === 0 ? "none" : v === 1 ? "mild" : "severe",
  weakness: (v) => v === 0 ? "none" : v === 1 ? "mild" : "severe",
  facial_swelling: (v) => v === 0 ? "none" : v === 1 ? "mild" : "severe",
};

const getRiskResult = (answers: Record<string, number>, language: Language): RiskResult => {
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
  // Max possible score depends on adaptive questions shown, use dynamic max
  const maxPossible = Object.keys(answers).length * 3; // rough average max per question
  const percentage = (totalScore / Math.max(maxPossible, 15)) * 100;

  // Build detailed explanation with severity
  const explanation: string[] = [];
  for (const [key, value] of Object.entries(answers)) {
    if (value > 0 && factorLabels[key]) {
      const severity = factorSeverity[key]?.(value) ?? "mild";
      const severityLabel = severity === "severe"
        ? (language === "en" ? "⚠️ HIGH" : language === "fr" ? "⚠️ ÉLEVÉ" : "⚠️")
        : (language === "en" ? "⚡ Moderate" : language === "fr" ? "⚡ Modéré" : "⚡");
      explanation.push(`${severityLabel}: ${factorLabels[key][language]}`);
    }
  }

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

  if (percentage >= 50 || (answers.bleeding ?? 0) >= 2 || totalScore >= 10) {
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
        fr: "Veuillez vous rendre immédiatement dans l'établissement de santé le plus proche.",
        ha: "Da fatan za a je cibiyar kiwon lafiya mafi kusa nan take.",
        yo: "Jọwọ lọ si ile-iṣẹ ilera ti o sunmọ julọ lẹsẹkẹsẹ.",
        ig: "Biko gaa ụlọ ahụike kacha nso ozugbo.",
      },
      explanation: explanation.length > 0 ? explanation : ["Multiple risk factors identified"],
      preventionTips,
    };
  } else if (percentage >= 25 || totalScore >= 5) {
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
        fr: "Isolez-vous et contactez un professionnel de santé dans les 24 heures.",
        ha: "Ku ware kanku kuma ku tuntuɓi ma'aikacin kiwon lafiya cikin awanni 24.",
        yo: "Ya ara rẹ sọtọ ki o si kan si olupese ilera laarin wakati 24.",
        ig: "Wepụ onwe gị ma kpọtụrụ onye na-enye ọrụ ahụike n'ime awa 24.",
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
        fr: "Continuez à pratiquer une bonne hygiène. Surveillez tout nouveau symptôme.",
        ha: "Ci gaba da yin tsafta mai kyau. Ku kula da duk wata sabuwar alamar.",
        yo: "Tẹsiwaju lati ṣe imọtoto to dara. Ṣọra fun awọn aami aisan tuntun.",
        ig: "Gaa n'ihu ịdị ọcha nke ọma. Lekwasị anya ihe mgbaàmà ọhụrụ.",
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
  const [saved, setSaved] = useState(false);
  const { language } = useLanguage();

  const result = showResult ? getRiskResult(answers, language) : null;

  // Save result to database when assessment is complete
  useEffect(() => {
    if (result && !saved) {
      setSaved(true);
      const saveAssessment = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const insertData: Record<string, unknown> = {
          risk_level: result.level,
          score: result.score,
          answers: answers,
          language: language,
        };
        if (session?.user?.id) {
          insertData.user_id = session.user.id;
        }
        const { error } = await supabase.from("risk_assessments").insert(insertData);
        if (error) console.error("Failed to save assessment:", error);
      };
      saveAssessment();
    }
  }, [result, saved, answers, language]);

  // Build adaptive question list based on current answers
  const activeQuestions = useMemo(() => {
    const questions: Question[] = [...baseQuestions];

    // Insert conditional symptom follow-ups after base symptom questions
    for (const cq of conditionalQuestions) {
      if (cq.condition(answers)) {
        questions.push(cq);
      }
    }

    // Add exposure questions
    questions.push(...exposureQuestions);

    // Insert conditional exposure follow-ups
    for (const cq of conditionalExposureQuestions) {
      if (cq.condition(answers)) {
        questions.push(cq);
      }
    }

    return questions;
  }, [answers]);

  const handleAnswer = (value: number) => {
    const currentQ = activeQuestions[currentQuestion];
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);

    // Recalculate questions with new answers to determine next step
    const updatedQuestions: Question[] = [...baseQuestions];
    for (const cq of conditionalQuestions) {
      if (cq.condition(newAnswers)) updatedQuestions.push(cq);
    }
    updatedQuestions.push(...exposureQuestions);
    for (const cq of conditionalExposureQuestions) {
      if (cq.condition(newAnswers)) updatedQuestions.push(cq);
    }

    if (currentQuestion < updatedQuestions.length - 1) {
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
    setSaved(false);
  };

  const progress = ((currentQuestion + (showResult ? 1 : 0)) / activeQuestions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">

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

      {/* Adaptive indicator */}
      {currentQuestion > 0 && !showResult && activeQuestions.length > baseQuestions.length + exposureQuestions.length && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg px-3 py-2 mb-4 text-sm text-muted-foreground flex items-center gap-2">
          <span>🧠</span>
          <span>
            {language === "en" && "Follow-up question based on your previous answers"}
            {language === "fr" && "Question de suivi basée sur vos réponses précédentes"}
            {language === "ha" && "Tambaya ta biyo baya dangane da amsoshinku"}
            {language === "yo" && "Ibeere atẹle ti o da lori awọn idahun rẹ tẹlẹ"}
            {language === "ig" && "Ajụjụ na-eso ụzọ dabere na azịza gị gara aga"}
          </span>
        </div>
      )}

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
        activeQuestions[currentQuestion] && (
          <RiskCheckerQuestion
            key={activeQuestions[currentQuestion].id}
            question={activeQuestions[currentQuestion]}
            currentIndex={currentQuestion}
            totalQuestions={activeQuestions.length}
            language={language}
            onAnswer={handleAnswer}
            onBack={handleBack}
            canGoBack={currentQuestion > 0}
          />
        )
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
