import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IntervuHero from "@/components/intervu/IntervuHero";
import ChallengeFlow, { ChallengeResult } from "@/components/intervu/ChallengeFlow";
import Results, { ScoredResult } from "@/components/intervu/Results";
import EmailGate from "@/components/intervu/EmailGate";
import Leaderboard from "@/components/intervu/Leaderboard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Phase = "hero" | "stream" | "challenge" | "results";

const STREAMS = ["Engineering", "MBA / BBA", "Commerce", "Arts", "Other"];

const Intervu = () => {
  const [phase, setPhase] = useState<Phase>("hero");
  const [stream, setStream] = useState<string>("Engineering");
  const [raw, setRaw] = useState<ChallengeResult | null>(null);
  const [scored, setScored] = useState<ScoredResult | null>(null);
  const [emailOpen, setEmailOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [savedId, setSavedId] = useState<string | undefined>();

  const computeAptitude = (r: ChallengeResult) => {
    const total = r.questions.aptitude.length;
    const correct = r.questions.aptitude.reduce(
      (acc, q, i) => acc + (r.aptitude_answers[i] === q.answer_index ? 1 : 0),
      0
    );
    return { correct, total };
  };

  const onChallengeDone = (r: ChallengeResult) => {
    setRaw(r);
    const apt = computeAptitude(r);
    const logicCorrect = r.logic_answer === r.questions.logic.answer_index ? 1 : 0;
    // Provisional score with neutral HR (50) until we score it
    const provisional: ScoredResult = {
      hr_score: 50,
      aptitude_score: apt.correct,
      aptitude_total: apt.total,
      logic_score: logicCorrect,
      logic_total: 1,
      total_score: Math.round(
        50 * 0.5 + (apt.correct / apt.total) * 100 * 0.35 + logicCorrect * 100 * 0.15
      ),
      strengths: ["Hidden — unlock to view"],
      weaknesses: ["Hidden — unlock to view"],
      tips: ["Hidden — unlock to view"],
    };
    setScored(provisional);
    setPhase("results");
  };

  const unlock = async (info: { name?: string; email: string }) => {
    if (!raw || !scored) return;
    setSubmitting(true);
    try {
      // Score HR via AI
      const { data, error } = await supabase.functions.invoke("intervu-ai", {
        body: {
          action: "score",
          hr_question: raw.questions.hr_question,
          hr_answer: raw.hr_answer,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);

      const hr = data as { score: number; strengths: string[]; weaknesses: string[]; tips: string[] };
      const apt = { correct: scored.aptitude_score, total: scored.aptitude_total };
      const logicCorrect = scored.logic_score;
      const total = Math.round(
        hr.score * 0.5 + (apt.correct / apt.total) * 100 * 0.35 + logicCorrect * 100 * 0.15
      );

      const finalScored: ScoredResult = {
        hr_score: hr.score,
        aptitude_score: apt.correct,
        aptitude_total: apt.total,
        logic_score: logicCorrect,
        logic_total: 1,
        total_score: total,
        strengths: hr.strengths,
        weaknesses: hr.weaknesses,
        tips: hr.tips,
      };

      // Save attempt
      const { data: inserted, error: insErr } = await supabase
        .from("intervu_attempts")
        .insert({
          name: info.name ?? null,
          email: info.email,
          stream,
          hr_question: raw.questions.hr_question,
          hr_answer: raw.hr_answer,
          hr_score: hr.score,
          hr_feedback: hr as any,
          aptitude_score: apt.correct,
          aptitude_total: apt.total,
          logic_score: logicCorrect,
          logic_total: 1,
          total_score: total,
          strengths: hr.strengths,
          weaknesses: hr.weaknesses,
          tips: hr.tips,
        })
        .select("id")
        .single();
      if (insErr) throw insErr;
      setSavedId(inserted!.id);

      // Percentile
      const { count: lower } = await supabase
        .from("intervu_attempts")
        .select("*", { count: "exact", head: true })
        .lt("total_score", total);
      const { count: totalCount } = await supabase
        .from("intervu_attempts")
        .select("*", { count: "exact", head: true });
      const pct =
        totalCount && totalCount > 1 ? Math.round(((lower ?? 0) / (totalCount - 1)) * 100) : undefined;

      setScored({ ...finalScored, percentile: pct });
      setEmailOpen(false);
      toast.success("Feedback unlocked!");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not unlock feedback";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setRaw(null);
    setScored(null);
    setSavedId(undefined);
    setPhase("hero");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {phase === "hero" && <IntervuHero onStart={() => setPhase("stream")} />}

        {phase === "stream" && (
          <section className="container mx-auto max-w-2xl px-4 py-24 text-center space-y-6">
            <h2 className="font-display text-3xl md:text-4xl font-bold">Pick your stream</h2>
            <p className="text-muted-foreground">We'll tailor the questions to you.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {STREAMS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStream(s);
                    setPhase("challenge");
                  }}
                  className="p-4 rounded-lg glass-card hover:border-primary hover:bg-primary/5 transition-all font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
          </section>
        )}

        {phase === "challenge" && (
          <ChallengeFlow stream={stream} onComplete={onChallengeDone} onCancel={reset} />
        )}

        {phase === "results" && scored && (
          <>
            <Results
              result={scored}
              blurred={!savedId}
              onUnlock={() => setEmailOpen(true)}
              onRetry={reset}
            />
            <Leaderboard highlightId={savedId} />
          </>
        )}

        <EmailGate open={emailOpen} onSubmit={unlock} loading={submitting} />
      </main>
      <Footer />
    </div>
  );
};

export default Intervu;
