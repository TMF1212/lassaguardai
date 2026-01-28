import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Info, RotateCcw, MapPin, Phone, Navigation, Lightbulb } from "lucide-react";
import { RiskResult as RiskResultType, RiskLevel, Language, translations, HealthcareFacility } from "@/types/riskChecker";

interface RiskResultProps {
  result: RiskResultType;
  language: Language;
  onRestart: () => void;
}

// Sample nearby facilities - in production, this would come from a geolocation API
const sampleFacilities: HealthcareFacility[] = [
  {
    name: "Federal Medical Centre",
    type: "Hospital",
    distance: "2.3 km",
    phone: "+234 800 123 4567",
    address: "123 Hospital Road",
  },
  {
    name: "Primary Health Centre",
    type: "Clinic",
    distance: "0.8 km",
    phone: "+234 800 234 5678",
    address: "45 Community Street",
  },
  {
    name: "General Hospital",
    type: "Hospital",
    distance: "5.1 km",
    phone: "+234 800 345 6789",
    address: "78 Main Avenue",
  },
];

const getRiskStyles = (level: RiskLevel) => {
  switch (level) {
    case "low":
      return "bg-risk-low/10 border-risk-low text-risk-low";
    case "medium":
      return "bg-risk-medium/10 border-risk-medium text-risk-medium";
    case "high":
      return "bg-risk-high/10 border-risk-high text-risk-high";
  }
};

const getRiskIcon = (level: RiskLevel) => {
  switch (level) {
    case "low":
      return <CheckCircle className="w-16 h-16" />;
    case "medium":
      return <Info className="w-16 h-16" />;
    case "high":
      return <AlertTriangle className="w-16 h-16" />;
  }
};

const RiskResult = ({ result, language, onRestart }: RiskResultProps) => {
  return (
    <div className="animate-slide-up space-y-6">
      {/* Main Result Card */}
      <Card className={`border-3 ${getRiskStyles(result.level)}`}>
        <CardContent className="p-6 md:p-8 text-center">
          <div className="mb-6">{getRiskIcon(result.level)}</div>
          <h3 className="text-2xl md:text-3xl font-bold font-display mb-4">
            {result.message[language]}
          </h3>
          <p className="text-lg md:text-xl mb-6 leading-relaxed">
            {result.action[language]}
          </p>

          {/* Explanation */}
          <div className="bg-background rounded-xl p-4 md:p-6 mb-6 text-left">
            <h4 className="font-semibold mb-3 text-foreground text-lg flex items-center gap-2">
              <Info className="w-5 h-5" />
              {translations.whyAssessment[language]}
            </h4>
            <ul className="space-y-2">
              {result.explanation.map((item, index) => (
                <li key={index} className="text-base text-muted-foreground flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-current flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Prevention Tips Card */}
      <Card className="border-2 border-accent/30 bg-accent/5">
        <CardContent className="p-6">
          <h4 className="font-semibold mb-4 text-foreground text-lg flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-accent" />
            {translations.preventionTips[language]}
          </h4>
          <ul className="space-y-3">
            {result.preventionTips[language].map((tip, index) => (
              <li key={index} className="text-base flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                  {index + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Healthcare Facilities Card */}
      <Card className="border-2">
        <CardContent className="p-6">
          <h4 className="font-semibold mb-4 text-foreground text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {translations.nearbyFacilities[language]}
          </h4>
          <div className="space-y-4">
            {sampleFacilities.map((facility, index) => (
              <div
                key={index}
                className="bg-secondary/50 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4"
              >
                <div className="flex-1">
                  <h5 className="font-semibold text-base">{facility.name}</h5>
                  <p className="text-sm text-muted-foreground">{facility.type} • {facility.distance}</p>
                  <p className="text-sm text-muted-foreground">{facility.address}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-2">
                    <Phone className="w-4 h-4" />
                    <span className="hidden sm:inline">{translations.callEmergency[language]}</span>
                  </Button>
                  <Button size="sm" variant="default" className="gap-2">
                    <Navigation className="w-4 h-4" />
                    <span className="hidden sm:inline">{translations.getDirections[language]}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Restart Button */}
      <div className="text-center">
        <Button onClick={onRestart} variant="outline" size="lg" className="text-lg py-6 px-8">
          <RotateCcw className="w-5 h-5 mr-2" />
          {translations.restart[language]}
        </Button>
      </div>
    </div>
  );
};

export default RiskResult;
