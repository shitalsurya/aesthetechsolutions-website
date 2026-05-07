import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Map, Save, CheckCircle2 } from "lucide-react";
import MMCCNav from "./MMCCNav";

const TEMPLATES: Record<string, string[]> = {
  "software engineer": [
    "Master one language deeply (Python or JavaScript)",
    "Build 3 portfolio projects (1 full-stack, 1 algorithmic, 1 open-source)",
    "Learn data structures & algorithms (LeetCode 150+)",
    "Cover system design fundamentals",
    "Practice mock interviews weekly",
    "Apply to 50+ targeted roles with a strong resume",
  ],
  "ui/ux designer": [
    "Master Figma & design fundamentals",
    "Study 20 product case studies",
    "Build 5 portfolio case studies",
    "Learn user research methods",
    "Get feedback in design communities",
    "Apply for internships / freelance gigs",
  ],
  "ai/ml engineer": [
    "Solidify Python + linear algebra + statistics",
    "Complete ML specialization (Coursera / fast.ai)",
    "Build 3 projects (CV, NLP, tabular)",
    "Learn PyTorch / TensorFlow",
    "Read 1 paper / week and reproduce",
    "Contribute to open-source ML repos",
  ],
  "product manager": [
    "Read 3 PM books (Inspired, Lean, Continuous Discovery)",
    "Take a PM course (Reforge / Product School)",
    "Build a product case study portfolio",
    "Learn SQL + basic analytics",
    "Practice CIRCLES / RICE frameworks",
    "Network with PMs on LinkedIn",
  ],
};

const Roadmap = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [career, setCareer] = useState("");
  const [steps, setSteps] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);

  const generate = () => {
    const key = career.toLowerCase().trim();
    const matched = Object.keys(TEMPLATES).find((k) => key.includes(k.split(" ")[0])) || "software engineer";
    setSteps(TEMPLATES[matched]);
  };

  const save = async () => {
    if (!user || !steps) return;
    setBusy(true);
    const { error } = await supabase.from("saved_roadmaps").insert({
      user_id: user.id, title: `${career} Roadmap`, career, steps,
    });
    setBusy(false);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else toast({ title: "Roadmap saved 🎯" });
  };

  return (
    <div className="min-h-screen bg-background">
      <MMCCNav />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 text-primary mb-2"><Map className="w-5 h-5" /><span className="text-sm uppercase tracking-widest">Roadmap Generator</span></div>
          <h1 className="font-display text-4xl font-bold mb-6">Generate Your Personal Roadmap</h1>

          <Card className="p-6 backdrop-blur-xl bg-card/60 mb-6">
            <Label htmlFor="career">Target career or role</Label>
            <div className="flex gap-3 mt-2">
              <Input id="career" value={career} onChange={(e) => setCareer(e.target.value)} placeholder="e.g. Software Engineer, UI/UX Designer, Product Manager" />
              <Button onClick={generate} variant="hero" disabled={!career.trim()}>Generate</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Try: Software Engineer · UI/UX Designer · AI/ML Engineer · Product Manager</p>
          </Card>

          {steps && (
            <Card className="p-6 backdrop-blur-xl bg-card/60">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold">{career} — 6 Step Plan</h2>
                {user && <Button onClick={save} disabled={busy} size="sm" variant="hero"><Save className="w-4 h-4" /> {busy ? "Saving..." : "Save"}</Button>}
              </div>
              <ol className="space-y-4">
                {steps.map((s, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="flex gap-4 p-4 rounded-xl bg-secondary/40">
                    <div className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                    <div className="pt-1"><CheckCircle2 className="w-4 h-4 text-primary inline mr-2" />{s}</div>
                  </motion.li>
                ))}
              </ol>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Roadmap;
