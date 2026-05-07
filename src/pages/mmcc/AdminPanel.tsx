import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, CreditCard, Brain, Mail } from "lucide-react";
import MMCCNav from "./MMCCNav";

const AdminPanel = () => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [emails, setEmails] = useState<any[]>([]);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    (async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      const ok = !!data?.some((r: any) => r.role === "admin");
      setIsAdmin(ok);
      if (!ok) return;
      const [pf, pa, ca, el] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("payments").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("career_assessments").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("email_logs").select("*").order("created_at", { ascending: false }).limit(50),
      ]);
      setProfiles(pf.data || []);
      setPayments(pa.data || []);
      setAssessments(ca.data || []);
      setEmails(el.data || []);
    })();
  }, [user]);

  if (loading || isAdmin === null) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (!user) return <Navigate to="/MindMapCareerCompass/auth" replace />;
  if (!isAdmin) return (
    <div className="min-h-screen bg-background"><MMCCNav />
      <div className="container mx-auto px-4 pt-32 text-center max-w-md">
        <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold mb-2">Admin only</h1>
        <p className="text-muted-foreground">You don't have permission to access this page.</p>
      </div>
    </div>
  );

  const totalRevenue = payments.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0) / 100;

  return (
    <div className="min-h-screen bg-background">
      <MMCCNav />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="font-display text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-6">Platform analytics & management</p>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-5"><Users className="w-5 h-5 text-primary mb-2" /><div className="text-2xl font-bold">{profiles.length}</div><div className="text-xs text-muted-foreground">Users</div></Card>
          <Card className="p-5"><CreditCard className="w-5 h-5 text-primary mb-2" /><div className="text-2xl font-bold">₹{totalRevenue.toFixed(0)}</div><div className="text-xs text-muted-foreground">Revenue</div></Card>
          <Card className="p-5"><Brain className="w-5 h-5 text-primary mb-2" /><div className="text-2xl font-bold">{assessments.length}</div><div className="text-xs text-muted-foreground">Assessments</div></Card>
          <Card className="p-5"><Mail className="w-5 h-5 text-primary mb-2" /><div className="text-2xl font-bold">{emails.length}</div><div className="text-xs text-muted-foreground">Emails Sent</div></Card>
        </div>

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="emails">Emails</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/40 text-left"><tr><th className="p-3">Email</th><th className="p-3">Name</th><th className="p-3">Plan</th><th className="p-3">Joined</th></tr></thead>
                <tbody>{profiles.map(p => <tr key={p.id} className="border-t border-border"><td className="p-3">{p.email}</td><td className="p-3">{p.full_name || "—"}</td><td className="p-3"><Badge variant={p.plan !== "free" ? "default" : "secondary"}>{p.plan}</Badge></td><td className="p-3 text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td></tr>)}</tbody>
              </table>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/40 text-left"><tr><th className="p-3">Email</th><th className="p-3">Plan</th><th className="p-3">Amount</th><th className="p-3">Status</th><th className="p-3">Date</th></tr></thead>
                <tbody>{payments.map(p => <tr key={p.id} className="border-t border-border"><td className="p-3">{p.email || "—"}</td><td className="p-3">{p.plan || "—"}</td><td className="p-3">₹{(p.amount/100).toFixed(2)}</td><td className="p-3"><Badge variant={p.status === "paid" ? "default" : "secondary"}>{p.status}</Badge></td><td className="p-3 text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td></tr>)}</tbody>
              </table>
            </Card>
          </TabsContent>

          <TabsContent value="assessments">
            <Card className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/40 text-left"><tr><th className="p-3">User</th><th className="p-3">Stream</th><th className="p-3">Career</th><th className="p-3">Date</th></tr></thead>
                <tbody>{assessments.map(a => <tr key={a.id} className="border-t border-border"><td className="p-3 font-mono text-xs">{a.user_id?.slice(0, 8)}…</td><td className="p-3">{a.recommended_stream}</td><td className="p-3">{a.recommended_career}</td><td className="p-3 text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</td></tr>)}</tbody>
              </table>
            </Card>
          </TabsContent>

          <TabsContent value="emails">
            <Card className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/40 text-left"><tr><th className="p-3">To</th><th className="p-3">Template</th><th className="p-3">Subject</th><th className="p-3">Status</th><th className="p-3">Date</th></tr></thead>
                <tbody>{emails.map(e => <tr key={e.id} className="border-t border-border"><td className="p-3">{e.to_email}</td><td className="p-3">{e.template}</td><td className="p-3 text-muted-foreground truncate max-w-xs">{e.subject}</td><td className="p-3"><Badge variant={e.status === "sent" ? "default" : "destructive"}>{e.status}</Badge></td><td className="p-3 text-muted-foreground">{new Date(e.created_at).toLocaleDateString()}</td></tr>)}</tbody>
              </table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
