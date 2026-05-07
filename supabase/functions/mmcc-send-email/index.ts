// MindMap Career Compass — Resend transactional email sender with branded templates
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const FROM = "MindMap Career Compass <support@aesthetechsolutions.co.in>";

function escape(s: unknown): string {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function shell(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${escape(title)}</title></head>
<body style="margin:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 12px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(15,23,42,.06);">
<tr><td style="background:linear-gradient(135deg,#0f172a 0%,#0d9488 100%);padding:28px 32px;color:#fff;">
<div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:.85;">MindMap Career Compass</div>
<div style="font-size:22px;font-weight:700;margin-top:6px;">${escape(title)}</div></td></tr>
<tr><td style="padding:32px;color:#0f172a;font-size:15px;line-height:1.6;">${bodyHtml}</td></tr>
<tr><td style="background:#f8fafc;padding:18px 32px;text-align:center;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0;">
© ${new Date().getFullYear()} AesthTech Solutions · <a href="https://aesthetechsolutions.co.in/MindMapCareerCompass" style="color:#0d9488;text-decoration:none;">aesthetechsolutions.co.in</a>
</td></tr></table></td></tr></table></body></html>`;
}

const TEMPLATES: Record<string, (d: any) => { subject: string; html: string }> = {
  welcome: (d) => ({
    subject: "Welcome to MindMap Career Compass 🎯",
    html: shell("Welcome aboard!", `<p>Hi ${escape(d?.name || "there")},</p>
      <p>You're now part of <strong>MindMap Career Compass</strong> — your personal guide to navigating your future with clarity.</p>
      <p>Start by taking the Career Assessment to unlock personalized roadmaps and recommendations.</p>
      <p><a href="https://aesthetechsolutions.co.in/MindMapCareerCompass/dashboard" style="display:inline-block;background:#0d9488;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600;">Open Dashboard</a></p>`),
  }),
  signup_confirmation: (d) => ({
    subject: "Confirm your email — MindMap Career Compass",
    html: shell("Confirm your email", `<p>Hi ${escape(d?.name || "there")},</p>
      <p>Thanks for signing up! Please confirm your email to activate your account.</p>
      ${d?.confirmUrl ? `<p><a href="${escape(d.confirmUrl)}" style="background:#0d9488;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600;">Confirm Email</a></p>` : ""}`),
  }),
  payment_confirmation: (d) => ({
    subject: `Payment Received — ${d?.plan || "Premium"}`,
    html: shell("Payment Confirmed ✅", `<p>Thank you for upgrading to <strong>${escape(d?.plan || "Premium")}</strong>!</p>
      <table style="width:100%;background:#f8fafc;border-radius:12px;padding:18px;margin:20px 0;">
        <tr><td style="color:#64748b;">Amount</td><td style="text-align:right;font-weight:600;">${escape(d?.currency || "INR")} ${escape(d?.amount || "")}</td></tr>
        <tr><td style="color:#64748b;">Payment ID</td><td style="text-align:right;font-family:monospace;font-size:12px;">${escape(d?.paymentId || "")}</td></tr>
      </table>
      <p>Your premium content is now unlocked in your dashboard.</p>`),
  }),
  career_tip: (d) => ({
    subject: d?.subject || "Your weekly career tip 💡",
    html: shell("Career Tip", `<p>${escape(d?.tip || "Keep learning, keep growing!")}</p>`),
  }),
  interview_reminder: (d) => ({
    subject: "Interview Challenge Reminder ⏰",
    html: shell("Don't lose your streak", `<p>You haven't completed today's challenge yet. Sharpen your skills in just 10 minutes.</p>
      <p><a href="https://aesthetechsolutions.co.in/intervu" style="background:#0d9488;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600;">Continue Challenge</a></p>`),
  }),
  quiz_completion: (d) => ({
    subject: `Your Career Assessment Result: ${d?.career || "Recommended Path"}`,
    html: shell("Assessment Complete 🎓", `<p>Great work! Based on your responses, your top match is:</p>
      <div style="background:#f0fdfa;border-left:4px solid #0d9488;padding:16px;border-radius:8px;margin:20px 0;">
        <div style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Recommended Career</div>
        <div style="font-size:22px;font-weight:700;color:#0f172a;margin-top:4px;">${escape(d?.career || "—")}</div>
        ${d?.stream ? `<div style="margin-top:6px;color:#475569;">Stream: ${escape(d.stream)}</div>` : ""}
      </div>
      <p><a href="https://aesthetechsolutions.co.in/MindMapCareerCompass/dashboard" style="background:#0d9488;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600;">View Roadmap</a></p>`),
  }),
  feedback: (d) => ({
    subject: "We received your feedback 🙏",
    html: shell("Thank you!", `<p>Hi ${escape(d?.name || "there")}, thanks for sharing your thoughts. Our team will review your message shortly.</p>`),
  }),
  admin_notification: (d) => ({
    subject: `[MMCC Admin] ${d?.event || "Notification"}`,
    html: shell("Admin Alert", `<pre style="background:#f8fafc;padding:14px;border-radius:8px;font-size:12px;overflow:auto;">${escape(JSON.stringify(d || {}, null, 2))}</pre>`),
  }),
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { to, template, data, subject: subjectOverride, html: htmlOverride } = await req.json();
    if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      return new Response(JSON.stringify({ error: "Invalid 'to' email" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) throw new Error("RESEND_API_KEY not configured");

    let subject = subjectOverride;
    let html = htmlOverride;
    if (!html) {
      const tpl = TEMPLATES[template];
      if (!tpl) return new Response(JSON.stringify({ error: `Unknown template: ${template}` }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const out = tpl(data || {});
      subject = subject || out.subject;
      html = out.html;
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [to], subject, html, reply_to: "support@aesthetechsolutions.co.in" }),
    });
    const result = await res.json();
    const ok = res.ok;

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    await supabase.from("email_logs").insert({
      to_email: to, template: template || "custom", subject,
      status: ok ? "sent" : "failed", error: ok ? null : JSON.stringify(result), meta: data || null,
    });

    if (!ok) throw new Error(result?.message || "Resend send failed");
    return new Response(JSON.stringify({ success: true, id: result.id }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
