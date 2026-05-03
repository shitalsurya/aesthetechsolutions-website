import { useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

const schema = z.object({
  name: z.string().trim().max(80).optional(),
  email: z.string().trim().email("Enter a valid email").max(255),
});

interface Props {
  open: boolean;
  onSubmit: (v: { name?: string; email: string }) => void;
  loading?: boolean;
}

const EmailGate = ({ open, onSubmit, loading }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse({ name: name || undefined, email });
    if (!r.success) {
      setErr(r.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setErr("");
    onSubmit(r.data);
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mb-2">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl font-display">
            Unlock your full feedback
          </DialogTitle>
          <DialogDescription className="text-center">
            Get strengths, weaknesses, and personalised improvement tips — plus a leaderboard spot.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3 pt-2">
          <Input
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
          />
          <Input
            type="email"
            placeholder="you@college.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={255}
            required
          />
          {err && <p className="text-sm text-destructive">{err}</p>}
          <Button variant="hero" className="w-full" type="submit" disabled={loading}>
            {loading ? "Analysing…" : "Unlock feedback"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            We'll never spam you. Used only to send your feedback and updates.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmailGate;
