import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Sparkles, RotateCcw, Save } from "lucide-react";
import MMCCNav from "./MMCCNav";

const questions = [
  { q: "Which activity sounds most exciting?", opts: [
    { t: "Building software / apps", w: { tech: 3, eng: 2 } },
    { t: "Designing products & visuals", w: { design: 3, tech: 1 } },
    { t: "Solving math/physics problems", w: { eng: 3, science: 2 } },
    { t: "Helping people & teaching", w: { humanities: 3, business: 1 } },
  ]},
  { q: "Pick the school subject you enjoy most:", opts: [
    { t: "Computer Science", w: { tech: 3 } },
    { t: "Physics / Maths", w: { eng: 3, science: 2 } },
    { t: "Biology", w: { science: 3 } },
    { t: "Economics / Business", w: { business: 3 } },
  ]},
  { q: "Your friends would describe you as:", opts: [
    { t: "Logical & analytical", w: { tech: 2, eng: 2 } },
    { t: "Creative & visual", w: { design: 3 } },
    { t: "Curious & research-driven", w: { science: 3 } },
    { t: "Persuasive & social", w: { business: 3, humanities: 1 } },
  ]},
  { q: "Preferred work environment?", opts: [
    { t: "Tech startup / product team", w: { tech: 3, business: 1 } },
    { t: "Research lab", w: { science: 3, eng: 1 } },
    { t: "Studio / creative agency", w: { design: 3 } },
    { t: "Corporate / consulting", w: { business: 3 } },
  ]},
  { q: "Which long-term goal resonates most?", opts: [
    { t: "Build & ship products at scale", w: { tech: 3, eng: 2 } },
    { t: "Drive business growth", w: { business: 3 } },
    { t: "Discover something new", w: { science: 3 } },
    { t: "Express ideas through design", w: { design: 3 } },
  ]},
];

const RECOMMEND: Record<string, { stream: string; career: string }> = {
  tech: { stream: "Science (PCM) → CS / IT", career: "Software Engineer / AI-ML Engineer" },
  eng: { stream: "Science (PCM)", career: "Mechanical / Electronics Engineer" },
  science: { stream: "Science (PCB / PCM)", career: "Research Scientist / Doctor" },
  design: { stream: "Arts / Design Foundation", career: "UI/UX Designer / Product Designer" },
  business: { stream: "Commerce / BBA", career: "Business Analyst / Product Manager" },
  humanities: { stream: "Humanities", career: "Educator / Content Strategist" },
};

const Quiz = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  const choose = (opt: any) => {
    const next = { ...scores };
    Object.entries(opt.w).forEach(([k, v]) => { next[k] = (next[k] || 0) + (v as number); });
    setScores(next);
    if (step + 1 < questions.length) setStep(step + 1);
    else setDone(true);
  };

  const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  const recommendation = top ? RECOMMEND[top[0]] : null;

  const reset = () => { setStep(0); setScores({}); setDone(false); };

  const save = async () => {
    if (!user || !recommendation) return;
    setSaving(true);
    const { error } = await supabase.from("career_assessments").insert({
      user_id: user.id, answers: scores,
      recommended_stream: recommendation.stream, recommended_career: recommendation.career, score: scores,
    });
    if (!error && user.email) {
      supabase.functions.invoke("mmcc-send-email", {
        body: { to: user.email, template: "quiz_completion", data: { career: recommendation.career, stream: recommendation.stream } },
      }).catch(() => {});
    }
    setSaving(false);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Saved to your dashboard ✨" }); navigate("/MindMapCareerCompass/dashboard"); }
  };

  return (
    <div className="min-h-screen bg-background">
      <MMCCNav />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-2xl">
        <Card className="p-8 backdrop-blur-xl bg-card/70 border-border/50">
          <div className="flex items-center gap-2 mb-2 text-primary"><Sparkles className="w-4 h-4" /><span className="text-xs uppercase tracking-widest">Career Compass Quiz</span></div>

          {!done ? (
            <>
              <Progress value={((step) / questions.length) * 100} className="mb-6" />
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">{questions[step].q}</h2>
                  <div className="space-y-3">
                    {questions[step].opts.map((o, i) => (
                      <button key={i} onClick={() => choose(o)} className="w-full text-left p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all group">
                        <div className="flex items-center justify-between">
                          <span>{o.t}</span>
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground mt-4 text-center">Question {step + 1} of {questions.length}</div>
                </motion.div>
              </AnimatePresence>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs uppercase tracking-wider mb-3">Your Match</div>
                <h2 className="font-display text-3xl font-bold">{recommendation?.career}</h2>
                <p className="text-muted-foreground mt-2">Suggested stream: <strong>{recommendation?.stream}</strong></p>
              </div>
              <div className="bg-secondary/40 rounded-xl p-4 mb-6">
                <div className="text-xs uppercase text-muted-foreground mb-2">Score Breakdown</div>
                <div className="space-y-2">
                  {Object.entries(scores).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
                    <div key={k}>
                      <div className="flex justify-between text-xs mb-1"><span className="capitalize">{k}</span><span>{v}</span></div>
                      <Progress value={(v / 15) * 100} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={reset} variant="outline" className="flex-1"><RotateCcw className="w-4 h-4" /> Retake</Button>
                {user ? (
                  <Button onClick={save} variant="hero" className="flex-1" disabled={saving}><Save className="w-4 h-4" /> {saving ? "Saving..." : "Save & View Roadmap"}</Button>
                ) : (
                  <Button onClick={() => navigate("/MindMapCareerCompass/auth?mode=signup")} variant="hero" className="flex-1">Sign up to save</Button>
                )}
              </div>
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Quiz;
