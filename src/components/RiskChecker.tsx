import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Info, ArrowLeft, RotateCcw } from "lucide-react";

interface Question {
  id: string;
  text: string;
  icon: string;
  options: { label: string; value: number }[];
}

const questions: Question[] = [
  {
    id: "fever",
    text: "Do you have a fever (temperature above 38°C/100.4°F)?",
    icon: "🌡️",
    options: [
      { label: "No", value: 0 },
      { label: "Mild fever", value: 1 },
      { label: "High fever", value: 2 },
    ],
  },
  {
    id: "headache",
    text: "Are you experiencing severe headache?",
    icon: "🤕",
    options: [
      { label: "No", value: 0 },
      { label: "Mild", value: 1 },
      { label: "Severe", value: 2 },
    ],
  },
  {
    id: "bleeding",
    text: "Any unusual bleeding (gums, nose, eyes)?",
    icon: "🩸",
    options: [
      { label: "No", value: 0 },
      { label: "Minor", value: 2 },
      { label: "Significant", value: 4 },
    ],
  },
  {
    id: "contact",
    text: "Have you had contact with someone diagnosed with Lassa fever?",
    icon: "👥",
    options: [
      { label: "No", value: 0 },
      { label: "Unsure", value: 1 },
      { label: "Yes", value: 3 },
    ],
  },
  {
    id: "rodents",
    text: "Have you had exposure to rodents or their droppings?",
    icon: "🐀",
    options: [
      { label: "No", value: 0 },
      { label: "Possibly", value: 1 },
      { label: "Yes", value: 2 },
    ],
  },
  {
    id: "travel",
    text: "Have you traveled to a Lassa fever endemic area in the past 21 days?",
    icon: "✈️",
    options: [
      { label: "No", value: 0 },
      { label: "Nearby region", value: 1 },
      { label: "Endemic area", value: 2 },
    ],
  },
];

type RiskLevel = "low" | "medium" | "high";

interface RiskResult {
  level: RiskLevel;
  score: number;
  message: string;
  action: string;
  explanation: string[];
}

const getRiskResult = (answers: Record<string, number>): RiskResult => {
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
  const maxScore = 15;
  const percentage = (totalScore / maxScore) * 100;

  const explanation: string[] = [];
  if (answers.fever > 0) explanation.push("Fever detected as a symptom");
  if (answers.bleeding > 0) explanation.push("Bleeding symptoms reported");
  if (answers.contact > 0) explanation.push("Potential contact exposure");
  if (answers.rodents > 0) explanation.push("Rodent exposure risk factor");
  if (answers.travel > 0) explanation.push("Travel to endemic area");

  if (percentage >= 60 || answers.bleeding >= 2) {
    return {
      level: "high",
      score: totalScore,
      message: "High Risk - Seek Immediate Medical Attention",
      action: "Please go to the nearest healthcare facility immediately. Inform them of your symptoms and exposure history.",
      explanation: explanation.length > 0 ? explanation : ["Multiple risk factors identified"],
    };
  } else if (percentage >= 30) {
    return {
      level: "medium",
      score: totalScore,
      message: "Medium Risk - Medical Consultation Recommended",
      action: "Self-isolate and contact a healthcare provider within 24 hours. Monitor your symptoms closely.",
      explanation: explanation.length > 0 ? explanation : ["Some risk factors present"],
    };
  } else {
    return {
      level: "low",
      score: totalScore,
      message: "Low Risk - Continue Monitoring",
      action: "Continue to practice good hygiene. Monitor for any new symptoms over the next 7-14 days.",
      explanation: explanation.length > 0 ? explanation : ["No significant risk factors identified"],
    };
  }
};

const RiskChecker = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);

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

  const getRiskStyles = (level: RiskLevel) => {
    switch (level) {
      case "low":
        return "bg-success/10 border-success text-success";
      case "medium":
        return "bg-warning/10 border-warning text-warning";
      case "high":
        return "bg-destructive/10 border-destructive text-destructive";
    }
  };

  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case "low":
        return <CheckCircle className="w-12 h-12" />;
      case "medium":
        return <Info className="w-12 h-12" />;
      case "high":
        return <AlertTriangle className="w-12 h-12" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Important:</strong> This tool does not provide medical diagnosis or treatment. 
            It is designed to help assess risk and guide next steps. Always consult a healthcare professional.
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {!showResult ? (
        <Card className="animate-fade-in">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <span className="text-5xl mb-4 block">{questions[currentQuestion].icon}</span>
              <h3 className="text-xl font-semibold font-display mb-2">
                Question {currentQuestion + 1} of {questions.length}
              </h3>
              <p className="text-lg text-muted-foreground">
                {questions[currentQuestion].text}
              </p>
            </div>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full py-6 text-lg justify-start hover:bg-primary/5 hover:border-primary transition-all"
                  onClick={() => handleAnswer(option.value)}
                >
                  <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center mr-4 text-sm font-medium">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option.label}
                </Button>
              ))}
            </div>

            {currentQuestion > 0 && (
              <Button variant="ghost" className="mt-6" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous Question
              </Button>
            )}
          </CardContent>
        </Card>
      ) : result && (
        <div className="animate-slide-up">
          <Card className={`border-2 ${getRiskStyles(result.level)}`}>
            <CardContent className="p-8 text-center">
              <div className="mb-6">{getRiskIcon(result.level)}</div>
              <h3 className="text-2xl font-bold font-display mb-4">{result.message}</h3>
              <p className="text-lg mb-6">{result.action}</p>
              
              <div className="bg-background rounded-lg p-4 mb-6 text-left">
                <h4 className="font-semibold mb-2 text-foreground">Why this assessment:</h4>
                <ul className="space-y-1">
                  {result.explanation.map((item, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Button onClick={handleRestart} variant="outline" className="mt-4">
                <RotateCcw className="w-4 h-4 mr-2" />
                Start New Assessment
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RiskChecker;