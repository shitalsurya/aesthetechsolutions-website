import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Crown, Shield, CreditCard, Loader2 } from "lucide-react";
import MMCCNav from "./MMCCNav";

declare global {
  interface Window { Razorpay: any }
}

const loadScript = (src: string) => new Promise<boolean>((resolve) => {
  if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
  const s = document.createElement("script");
  s.src = src; s.onload = () => resolve(true); s.onerror = () => resolve(false);
  document.body.appendChild(s);
});

const Checkout = () => {
  const [params] = useSearchParams();
  const plan = params.get("plan") || "pro";
  const amount = Number(params.get("amount") || 499);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const pay = async () => {
    setBusy(true);
    try {
      const ok = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!ok) throw new Error("Razorpay SDK failed to load");

      const { data, error } = await supabase.functions.invoke("razorpay-create-order", {
        body: { amount: amount * 100, currency: "INR", plan, email: user?.email },
      });
      if (error || !data?.orderId) throw new Error(error?.message || "Order creation failed");

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "MindMap Career Compass",
        description: `${plan.toUpperCase()} subscription`,
        order_id: data.orderId,
        prefill: { email: user?.email || "" },
        theme: { color: "#0d9488" },
        handler: async (resp: any) => {
          const verify = await supabase.functions.invoke("razorpay-verify-payment", {
            body: {
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
              plan,
            },
          });
          if (verify.error || !verify.data?.verified) {
            toast({ title: "Verification failed", variant: "destructive" });
            return;
          }
          toast({ title: "Payment successful 🎉", description: `${plan.toUpperCase()} unlocked` });
          navigate("/MindMapCareerCompass/dashboard");
        },
        modal: { ondismiss: () => setBusy(false) },
      });
      rzp.on("payment.failed", (r: any) => toast({ title: "Payment failed", description: r.error?.description, variant: "destructive" }));
      rzp.open();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
      setBusy(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <MMCCNav />
        <div className="container mx-auto px-4 pt-32 text-center">
          <p className="mb-4">Please sign in to continue.</p>
          <Button asChild variant="hero"><a href={`/MindMapCareerCompass/auth?mode=signin`}>Sign In</a></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MMCCNav />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-md">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-8 backdrop-blur-xl bg-card/70">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-teal flex items-center justify-center"><Crown className="w-6 h-6 text-white" /></div>
              <div>
                <h1 className="font-display text-2xl font-bold">{plan.toUpperCase()} Plan</h1>
                <p className="text-xs text-muted-foreground">MindMap Career Compass</p>
              </div>
            </div>
            <div className="bg-secondary/40 rounded-xl p-5 mb-6">
              <div className="flex justify-between text-sm mb-2"><span>Plan</span><span className="font-medium">{plan}</span></div>
              <div className="flex justify-between text-sm mb-2"><span>Email</span><span className="font-medium">{user.email}</span></div>
              <div className="border-t border-border my-3" />
              <div className="flex justify-between text-lg font-bold"><span>Total</span><span>₹{amount}</span></div>
            </div>
            <Button onClick={pay} disabled={busy} variant="hero" className="w-full" size="lg">
              {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <><CreditCard className="w-4 h-4" /> Pay with Razorpay</>}
            </Button>
            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="w-3 h-3" /> Secure payment by Razorpay
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
