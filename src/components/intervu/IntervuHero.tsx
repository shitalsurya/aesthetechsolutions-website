import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trophy, Zap, Target } from "lucide-react";

interface Props {
  onStart: () => void;
}

const IntervuHero = ({ onStart }: Props) => (
  <section className="relative overflow-hidden pt-32 pb-20 px-4 md:px-8">
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-background" />
    <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10" />

    <div className="container mx-auto max-w-5xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-sm font-medium mb-6"
      >
        <Zap className="h-4 w-4 text-primary" />
        Intervu · Compete. Improve. Get Hired.
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6"
      >
        Take the <span className="gradient-text">5-Minute</span>
        <br />
        Interview Challenge
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
      >
        Test your real interview readiness for placements. AI-powered scoring,
        instant feedback, and a live leaderboard.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
      >
        <Button variant="hero" size="lg" onClick={onStart}>
          <Target className="mr-1" /> Start Challenge
        </Button>
        <Button variant="heroOutline" size="lg" asChild>
          <a href="#leaderboard">
            <Trophy className="mr-1" /> View Leaderboard
          </a>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
      >
        {[
          { label: "Engineering", emoji: "⚙️" },
          { label: "MBA / BBA", emoji: "📊" },
          { label: "Commerce", emoji: "💼" },
          { label: "Arts", emoji: "🎨" },
        ].map((s) => (
          <div
            key={s.label}
            className="glass-card p-4 text-sm font-medium flex flex-col items-center gap-1"
          >
            <span className="text-2xl">{s.emoji}</span>
            {s.label}
          </div>
        ))}
      </motion.div>
      <p className="text-xs text-muted-foreground mt-4">
        Built for freshers across all streams
      </p>
    </div>
  </section>
);

export default IntervuHero;
