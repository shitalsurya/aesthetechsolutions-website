// Verify Razorpay signature and mark payment paid + upgrade subscription
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createHmac } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = await req.json();
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!keySecret) throw new Error("RAZORPAY_KEY_SECRET missing");

    const expected = createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    if (expected !== razorpay_signature) {
      return new Response(JSON.stringify({ verified: false, error: "Signature mismatch" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabase.auth.getUser(token);
      userId = data.user?.id ?? null;
    }

    await supabase.from("payments").update({
      status: "paid", razorpay_payment_id, razorpay_signature,
    }).eq("razorpay_order_id", razorpay_order_id);

    if (userId && plan) {
      await supabase.from("profiles").update({ plan }).eq("user_id", userId);
      await supabase.from("subscriptions").insert({
        user_id: userId, plan, status: "active",
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    // Send confirmation email (best-effort)
    try {
      const { data: pay } = await supabase.from("payments").select("email,amount,currency,plan").eq("razorpay_order_id", razorpay_order_id).maybeSingle();
      if (pay?.email) {
        await supabase.functions.invoke("mmcc-send-email", {
          body: {
            to: pay.email, template: "payment_confirmation",
            data: { amount: (pay.amount / 100).toFixed(2), currency: pay.currency, plan: pay.plan || plan || "Premium", paymentId: razorpay_payment_id },
          },
        });
      }
    } catch (_) { /* ignore */ }

    return new Response(JSON.stringify({ verified: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
