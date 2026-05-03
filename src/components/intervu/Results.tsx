import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, RefreshCw, Share2, Linkedin, MessageCircle, Link as LinkIcon, CheckCircle2, AlertCircle, Lightbulb } from "lucide-react";
import { toast } from "sonner";

export interface ScoredResult {
  total_score: number;
  hr_score: number;
  aptitude_score: number;
  aptitude_total: number;
  logic_score: number;
  logic_total: number;
  strengths: string[];
  weaknesses: string[];
  tips: string[];
  percentile?: number;
}

interface Props {
  result: ScoredResult;
  blurred: boolean;
  onUnlock: () => void;
  onRetry: () => void;
}

const Results = ({ result, blurred, onUnlock, onRetry }: Props) => {
  const shareText = `I scored ${result.total_score}/100 on the Intervu Challenge. Can you beat me? https://aesthetechsolutions.lovable.app/intervu`;

  const share = (where: "linkedin" | "whatsapp" | "copy") => {
    if (where === "linkedin") {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://aesthetechsolutions.lovable.app/intervu")}&summary=${encodeURIComponent(shareText)}`,
        "_blank"
      );
    } else if (where === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-sm">
          <Trophy className="h-4 w-4 text-primary" /> Challenge complete
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-bold">
          <span className="gradient-text">{result.total_score}</span>
          <span className="text-muted-foreground text-3xl">/100</span>
        </h1>
        {result.percentile !== undefined && (
          <p className="text-muted-foreground">
            You scored higher than <span className="text-foreground font-semibold">{result.percentile}%</span> of students
          </p>
        )}
      </motion.div>

      {/* Section breakdown */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "HR Answer", val: `${result.hr_score}/100` },
          { label: "Aptitude", val: `${result.aptitude_score}/${result.aptitude_total}` },
          { label: "Logic", val: `${result.logic_score}/${result.logic_total}` },
        ].map((s) => (
          <Card key={s.label} className="p-5 text-center">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className="text-2xl font-display font-bold mt-1">{s.val}</div>
          </Card>
        ))}
      </div>

      {/* Feedback (blurred until email) */}
      <div className="relative">
        <div className={blurred ? "blur-md select-none pointer-events-none" : ""}>
          <div className="grid md:grid-cols-3 gap-4">
            <FeedbackCard icon={<CheckCircle2 className="text-primary" />} title="Strengths" items={result.strengths} />
            <FeedbackCard icon={<AlertCircle className="text-destructive" />} title="Weaknesses" items={result.weaknesses} />
            <FeedbackCard icon={<Lightbulb className="text-primary" />} title="Improvement Tips" items={result.tips} />
          </div>
        </div>
        {blurred && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button variant="hero" size="lg" onClick={onUnlock}>
              Unlock full feedback
            </Button>
          </div>
        )}
      </div>

      {!blurred && (
        <Card className="p-6 space-y-4">
          <h3 className="font-display text-xl font-semibold flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" /> Share your score
          </h3>
          <p className="text-sm text-muted-foreground">
            "I scored {result.total_score} on the Intervu Challenge. Can you beat me?"
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => share("linkedin")}>
              <Linkedin /> LinkedIn
            </Button>
            <Button variant="outline" onClick={() => share("whatsapp")}>
              <MessageCircle /> WhatsApp
            </Button>
            <Button variant="outline" onClick={() => share("copy")}>
              <LinkIcon /> Copy link
            </Button>
            <Button variant="hero" onClick={onRetry} className="ml-auto">
              <RefreshCw /> Try again
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-6 bg-gradient-to-r from-primary/15 to-primary/5 border-primary/30">
        <p className="font-display text-lg font-semibold">
          🏆 Top 100 students get early access to Intervu
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Keep climbing the leaderboard to unlock priority access and placement resources.
        </p>
      </Card>
    </div>
  );
};

const FeedbackCard = ({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) => (
  <Card className="p-5 space-y-3">
    <div className="flex items-center gap-2 font-semibold">
      {icon} {title}
    </div>
    <ul className="space-y-2 text-sm text-muted-foreground">
      {items.length === 0 ? (
        <li>—</li>
      ) : (
        items.map((it, i) => <li key={i}>• {it}</li>)
      )}
    </ul>
  </Card>
);

export default Results;
