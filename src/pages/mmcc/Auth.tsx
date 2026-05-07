import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Compass, Mail, Lock, ArrowLeft } from "lucide-react";

type Mode = "signin" | "signup" | "forgot" | "reset";

const Auth = () => {
  const [params] = useSearchParams();
  const initialMode = (params.get("mode") as Mode) || "signin";
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Detect recovery flow from email link
    if (window.location.hash.includes("type=recovery")) setMode("reset");
  }, []);

  useEffect(() => {
    if (!loading && user && mode !== "reset") navigate("/MindMapCareerCompass/dashboard", { replace: true });
  }, [user, loading, mode, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Welcome back!" });
      } else if (mode === "signup") {
        const { error, data } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/MindMapCareerCompass/dashboard`, data: { full_name: name } },
        });
        if (error) throw error;
        toast({ title: "Account created", description: "Check your email to confirm." });
        if (data.user?.email) {
          supabase.functions.invoke("mmcc-send-email", { body: { to: data.user.email, template: "welcome", data: { name } } }).catch(() => {});
        }
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/MindMapCareerCompass/auth` });
        if (error) throw error;
        toast({ title: "Reset link sent", description: "Check your inbox." });
        setMode("signin");
      } else if (mode === "reset") {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        toast({ title: "Password updated" });
        navigate("/MindMapCareerCompass/dashboard");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    try {
      const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/MindMapCareerCompass/dashboard` });
      if (r.error) throw r.error;
    } catch (err: any) {
      toast({ title: "Google sign-in failed", description: err.message, variant: "destructive" });
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Link to="/MindMapCareerCompass" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to MindMap
        </Link>
        <Card className="p-8 backdrop-blur-xl bg-card/80 border-border/50 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-primary/10"><Compass className="w-6 h-6 text-primary" /></div>
            <div>
              <h1 className="font-display text-2xl font-bold">MindMap Career Compass</h1>
              <p className="text-xs text-muted-foreground">Navigate your future with clarity</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-1">
            {mode === "signin" && "Welcome back"}
            {mode === "signup" && "Create your account"}
            {mode === "forgot" && "Reset password"}
            {mode === "reset" && "Set a new password"}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === "signin" && "Sign in to continue your career journey"}
            {mode === "signup" && "Start your personalized career roadmap today"}
            {mode === "forgot" && "We'll email you a reset link"}
            {mode === "reset" && "Choose a strong password"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Jane Doe" />
              </div>
            )}
            {mode !== "reset" && (
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="pl-10" />
                </div>
              </div>
            )}
            {(mode === "signin" || mode === "signup" || mode === "reset") && (
              <div className="space-y-1.5">
                <Label htmlFor="password">{mode === "reset" ? "New Password" : "Password"}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="••••••••" className="pl-10" />
                </div>
              </div>
            )}
            <Button type="submit" disabled={busy} variant="hero" className="w-full">
              {busy ? "Please wait..." :
                mode === "signin" ? "Sign In" :
                mode === "signup" ? "Create Account" :
                mode === "forgot" ? "Send Reset Link" : "Update Password"}
            </Button>
          </form>

          {mode !== "reset" && (
            <>
              <div className="flex items-center gap-3 my-5">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">OR</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <Button type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={busy}>
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
              </Button>
            </>
          )}

          <div className="mt-6 text-sm text-center space-y-2">
            {mode === "signin" && (
              <>
                <button onClick={() => setMode("forgot")} className="text-muted-foreground hover:text-primary block w-full">Forgot password?</button>
                <p className="text-muted-foreground">No account? <button onClick={() => setMode("signup")} className="text-primary font-medium">Sign up</button></p>
              </>
            )}
            {mode === "signup" && (
              <p className="text-muted-foreground">Already have an account? <button onClick={() => setMode("signin")} className="text-primary font-medium">Sign in</button></p>
            )}
            {mode === "forgot" && (
              <button onClick={() => setMode("signin")} className="text-muted-foreground hover:text-primary">Back to sign in</button>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
