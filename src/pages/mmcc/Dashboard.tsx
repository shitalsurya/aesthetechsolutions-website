import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Map, Trophy, Crown, ArrowRight, Sparkles, Shield } from "lucide-react";
import MMCCNav from "./MMCCNav";

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: p }, { data: a }, { data: r }, { data: pr }, { data: pay }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("career_assessments").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("saved_roadmaps").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("interview_progress").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("payments").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("user_roles").select("role").eq("user_id", user.id),
      ]);
      setProfile(p);
      setAssessments(a || []);
      setRoadmaps(r || []);
      setProgress(pr || []);
      setPayments(pay || []);
      setIsAdmin(!!roles?.some((x: any) => x.role === "admin"));
    })();
  }, [user]);

  const isPremium = profile?.plan && profile.plan !== "free";

  return (
    <div className="min-h-screen bg-background">
      <MMCCNav />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold">Welcome, {profile?.full_name || user?.email?.split("@")[0]}</h1>
              <p className="text-muted-foreground mt-1">Your career journey at a glance</p>
            </div>
            <div className="flex items-center gap-2">
              {isPremium && <Badge className="bg-gradient-to-r from-primary to-teal text-white"><Crown className="w-3 h-3 mr-1" /> {profile.plan.toUpperCase()}</Badge>}
              {isAdmin && <Button asChild variant="outline" size="sm"><Link to="/MindMapCareerCompass/admin"><Shield className="w-4 h-4" /> Admin</Link></Button>}
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Assessments Taken", value: assessments.length, icon: Brain },
            { label: "Saved Roadmaps", value: roadmaps.length, icon: Map },
            { label: "Challenges Done", value: progress.filter((x) => x.completed).length, icon: Trophy },
          ].map((s) => (
            <Card key={s.label} className="p-6 backdrop-blur-xl bg-card/60">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><s.icon className="w-6 h-6 text-primary" /></div>
                <div>
                  <div className="text-3xl font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6 backdrop-blur-xl bg-card/60">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-xl font-bold">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <Button asChild variant="hero" className="w-full justify-between"><Link to="/MindMapCareerCompass/quiz"><span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Take Career Assessment</span><ArrowRight className="w-4 h-4" /></Link></Button>
              <Button asChild variant="outline" className="w-full justify-between"><Link to="/MindMapCareerCompass/roadmap"><span className="flex items-center gap-2"><Map className="w-4 h-4" /> Generate New Roadmap</span><ArrowRight className="w-4 h-4" /></Link></Button>
              <Button asChild variant="outline" className="w-full justify-between"><Link to="/intervu"><span className="flex items-center gap-2"><Trophy className="w-4 h-4" /> Try Intervu Challenge</span><ArrowRight className="w-4 h-4" /></Link></Button>
              {!isPremium && <Button asChild variant="outline" className="w-full justify-between border-primary/40"><Link to="/MindMapCareerCompass/checkout?plan=pro&amount=499"><span className="flex items-center gap-2"><Crown className="w-4 h-4 text-primary" /> Upgrade to Pro</span><ArrowRight className="w-4 h-4" /></Link></Button>}
            </div>
          </Card>

          <Card className="p-6 backdrop-blur-xl bg-card/60">
            <h2 className="font-display text-xl font-bold mb-4">Recent Assessments</h2>
            {assessments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No assessments yet. <Link to="/MindMapCareerCompass/quiz" className="text-primary">Start one</Link></p>
            ) : (
              <div className="space-y-3">
                {assessments.map((a) => (
                  <div key={a.id} className="p-3 rounded-lg bg-secondary/40">
                    <div className="font-medium text-sm">{a.recommended_career || "Assessment"}</div>
                    <div className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()} · {a.recommended_stream}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6 backdrop-blur-xl bg-card/60">
            <h2 className="font-display text-xl font-bold mb-4">Saved Roadmaps</h2>
            {roadmaps.length === 0 ? (
              <p className="text-sm text-muted-foreground">No roadmaps saved yet.</p>
            ) : (
              <div className="space-y-3">
                {roadmaps.map((r) => (
                  <div key={r.id} className="p-3 rounded-lg bg-secondary/40">
                    <div className="font-medium text-sm">{r.title}</div>
                    <div className="text-xs text-muted-foreground">{r.career}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6 backdrop-blur-xl bg-card/60">
            <h2 className="font-display text-xl font-bold mb-4">Payment History</h2>
            {payments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No payments yet.</p>
            ) : (
              <div className="space-y-3">
                {payments.map((p) => (
                  <div key={p.id} className="p-3 rounded-lg bg-secondary/40 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm">{p.plan || "Purchase"}</div>
                      <div className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm">{p.currency} {(p.amount/100).toFixed(2)}</div>
                      <Badge variant={p.status === "paid" ? "default" : "secondary"} className="text-xs">{p.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
