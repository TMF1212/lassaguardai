import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Question, Language, translations } from "@/types/riskChecker";

interface RiskCheckerQuestionProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  language: Language;
  onAnswer: (value: number) => void;
  onBack: () => void;
  canGoBack: boolean;
}

const RiskCheckerQuestion = ({
  question,
  currentIndex,
  totalQuestions,
  language,
  onAnswer,
  onBack,
  canGoBack,
}: RiskCheckerQuestionProps) => {
  return (
    <Card className="animate-fade-in border-2 shadow-lg">
      <CardContent className="p-6 md:p-8">
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block" role="img" aria-label="Question icon">
            {question.icon}
          </span>
          <h3 className="text-xl md:text-2xl font-semibold font-display mb-2">
            {translations.question[language]} {currentIndex + 1} {translations.of[language]} {totalQuestions}
          </h3>
          <p className="text-lg md:text-xl text-foreground leading-relaxed font-medium">
            {question.text[language]}
          </p>
        </div>

        <div className="space-y-4">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full py-6 md:py-8 text-lg md:text-xl justify-start hover:bg-primary/5 hover:border-primary hover:scale-[1.02] transition-all duration-200 rounded-xl"
              onClick={() => onAnswer(option.value)}
            >
              <span className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary flex items-center justify-center mr-4 text-base md:text-lg font-bold">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-left">{option.label[language]}</span>
            </Button>
          ))}
        </div>

        {canGoBack && (
          <Button variant="ghost" className="mt-6 text-base" onClick={onBack}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            {translations.previous[language]}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskCheckerQuestion;
