import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowRight } from "lucide-react";
import Timer from "./Timer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MCQ {
  category?: string;
  question: string;
  options: string[];
  answer_index: number;
}

export interface QuestionSet {
  hr_question: string;
  aptitude: MCQ[];
  logic: MCQ;
}

export interface ChallengeResult {
  questions: QuestionSet;
  hr_answer: string;
  aptitude_answers: number[];
  logic_answer: number;
}

interface Props {
  stream: string;
  onComplete: (r: ChallengeResult) => void;
  onCancel: () => void;
}

const ChallengeFlow = ({ stream, onComplete, onCancel }: Props) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QuestionSet | null>(null);
  const [step, setStep] = useState(0); // 0=HR, 1=Aptitude, 2=Logic
  const [hrAnswer, setHrAnswer] = useState("");
  const [aptIdx, setAptIdx] = useState(0);
  const [aptAnswers, setAptAnswers] = useState<number[]>([]);
  const [logicAnswer, setLogicAnswer] = useState(-1);
  const [selected, setSelected] = useState<number>(-1);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("intervu-ai", {
          body: { action: "generate", stream },
        });
        if (error) throw error;
        if ((data as any)?.error) throw new Error((data as any).error);
        setQuestions(data as QuestionSet);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load questions";
        toast.error(msg);
        onCancel();
      } finally {
        setLoading(false);
      }
    })();
  }, [stream, onCancel]);

  if (loading || !questions) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Generating fresh questions for you…</p>
      </div>
    );
  }

  const totalSteps = 3;
  const progress = ((step + (step === 1 ? aptIdx / questions.aptitude.length : 0)) / totalSteps) * 100;

  const finishHR = () => {
    setStep(1);
    setSelected(-1);
  };

  const submitApt = () => {
    const next = [...aptAnswers, selected];
    setAptAnswers(next);
    setSelected(-1);
    if (aptIdx + 1 < questions.aptitude.length) {
      setAptIdx(aptIdx + 1);
    } else {
      setStep(2);
    }
  };

  const submitLogic = () => {
    setLogicAnswer(selected);
    onComplete({
      questions,
      hr_answer: hrAnswer,
      aptitude_answers: [...aptAnswers],
      logic_answer: selected,
    });
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Step {step + 1} of {totalSteps}</span>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            Exit
          </button>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="hr"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-primary font-semibold">
                  HR Question
                </span>
                <h2 className="text-xl md:text-2xl font-display font-semibold">
                  {questions.hr_question}
                </h2>
              </div>
              <Timer seconds={90} onExpire={finishHR} />
              <Textarea
                value={hrAnswer}
                onChange={(e) => setHrAnswer(e.target.value.slice(0, 1500))}
                placeholder="Type your answer here. Be specific, use examples (STAR method)."
                className="min-h-[180px]"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{hrAnswer.length}/1500</span>
                <Button variant="hero" onClick={finishHR} disabled={hrAnswer.trim().length < 20}>
                  Continue <ArrowRight />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key={`apt-${aptIdx}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-primary font-semibold">
                  Aptitude · {questions.aptitude[aptIdx].category} ({aptIdx + 1}/{questions.aptitude.length})
                </span>
                <h2 className="text-xl md:text-2xl font-display font-semibold">
                  {questions.aptitude[aptIdx].question}
                </h2>
              </div>
              <Timer seconds={60} onExpire={submitApt} key={aptIdx} />
              <div className="grid gap-2">
                {questions.aptitude[aptIdx].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      selected === i
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <Button variant="hero" onClick={submitApt} disabled={selected === -1}>
                  {aptIdx + 1 < questions.aptitude.length ? "Next question" : "Continue"} <ArrowRight />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="logic"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-primary font-semibold">
                  Logical Reasoning
                </span>
                <h2 className="text-xl md:text-2xl font-display font-semibold">
                  {questions.logic.question}
                </h2>
              </div>
              <Timer seconds={75} onExpire={submitLogic} />
              <div className="grid gap-2">
                {questions.logic.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      selected === i
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <Button variant="hero" onClick={submitLogic} disabled={selected === -1}>
                  Finish challenge <ArrowRight />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChallengeFlow;
