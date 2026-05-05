// Send candidate interview feedback via Gmail SMTP
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Payload {
  name?: string;
  email: string;
  score: number;
  feedback: string;
  suggestions?: string[];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildHtml(p: Payload): string {
  const name = p.name?.trim() || "Candidate";
  const score = Math.max(0, Math.min(100, Number(p.score) || 0));
  const scoreColor = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  const suggestionsHtml =
    p.suggestions && p.suggestions.length
      ? `<h3 style="margin:24px 0 8px;font-size:16px;color:#0f172a;">Suggestions for Improvement</h3>
         <ul style="padding-left:20px;color:#334155;line-height:1.6;margin:0;">
           ${p.suggestions.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}
         </ul>`
      : "";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><title>Your Interview Feedback</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 12px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(15,23,42,0.06);">
        <tr><td style="background:linear-gradient(135deg,#0f172a 0%,#0d9488 100%);padding:28px 32px;color:#ffffff;">
          <div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;opacity:0.85;">Aesthetech Solutions</div>
          <div style="font-size:24px;font-weight:700;margin-top:6px;">Your Interview Feedback</div>
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="margin:0 0 16px;font-size:16px;color:#0f172a;">Hi ${escapeHtml(name)},</p>
          <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
            Thanks for completing the Intervu Challenge. Here's a summary of your performance.
          </p>
          <div style="text-align:center;margin:24px 0;padding:24px;background:#f8fafc;border-radius:12px;">
            <div style="font-size:12px;letter-spacing:1.5px;color:#64748b;text-transform:uppercase;">Your Score</div>
            <div style="font-size:56px;font-weight:800;color:${scoreColor};line-height:1;margin-top:8px;">
              ${score}<span style="font-size:22px;color:#94a3b8;font-weight:600;">/100</span>
            </div>
          </div>
          <h3 style="margin:24px 0 8px;font-size:16px;color:#0f172a;">Feedback Summary</h3>
          <p style="margin:0;color:#334155;line-height:1.6;font-size:14px;white-space:pre-wrap;">${escapeHtml(p.feedback)}</p>
          ${suggestionsHtml}
          <p style="margin:32px 0 0;font-size:14px;color:#475569;line-height:1.6;">
            Keep practicing — every attempt sharpens your edge. We're rooting for you! 🚀
          </p>
          <p style="margin:16px 0 0;font-size:14px;color:#0f172a;">
            Warm regards,<br/><strong>The Aesthetech Solutions Team</strong>
          </p>
        </td></tr>
        <tr><td style="background:#f8fafc;padding:20px 32px;text-align:center;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0;">
          © ${new Date().getFullYear()} Aesthetech Solutions · support@aesthetechsolutions.co.in
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendWithRetry(p: Payload, maxAttempts = 3): Promise<number> {
  const user = "contact2aesthetechsolutions@gmail.com";
  const pass = Deno.env.get("GMAIL_APP_PASSWORD");
  if (!pass) throw new Error("GMAIL_APP_PASSWORD not configured");

  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: { username: user, password: pass.replace(/\s+/g, "") },
      },
      pool: false,
      debug: { log: false, allowUnsecure: false, encodeLB: false, noStartTLS: false },
    });
    try {
      await client.send({
        from: "Aesthetech Solutions <support@aesthetechsolutions.co.in>",
        replyTo: "support@aesthetechsolutions.co.in",
        to: p.email,
        bcc: "contact2aesthetechsolutions@gmail.com",
        subject: `Your Interview Feedback — Score ${p.score}/100`,
        content: `Hi ${p.name || "Candidate"},\n\nYour interview score: ${p.score}/100\n\n${p.feedback}\n\n— Aesthetech Solutions`,
        html: buildHtml(p),
      });
      await client.close();
      return attempt;
    } catch (e) {
      lastErr = e;
      try { await client.close(); } catch (_) { /* ignore */ }
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, 500 * attempt));
      }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const errors: string[] = [];
  if (!body.email || !EMAIL_RE.test(body.email)) errors.push("Valid 'email' is required");
  if (typeof body.score !== "number" || body.score < 0 || body.score > 100)
    errors.push("'score' must be a number between 0 and 100");
  if (!body.feedback || typeof body.feedback !== "string" || body.feedback.trim().length < 3)
    errors.push("'feedback' is required");
  if (errors.length) {
    return new Response(JSON.stringify({ error: errors.join("; ") }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: log } = await supabase
    .from("feedback_logs")
    .insert({
      name: body.name ?? null,
      email: body.email,
      score: body.score,
      feedback: body.feedback,
      status: "pending",
    })
    .select("id")
    .single();

  try {
    const attempts = await sendWithRetry(body);
    if (log?.id) {
      await supabase
        .from("feedback_logs")
        .update({ status: "sent", attempts })
        .eq("id", log.id);
    }
    return new Response(JSON.stringify({ success: true, status: "sent", attempts }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (log?.id) {
      await supabase
        .from("feedback_logs")
        .update({ status: "failed", error_message: msg, attempts: 3 })
        .eq("id", log.id);
    }
    console.error("send-feedback error:", msg);
    return new Response(JSON.stringify({ success: false, status: "failed", error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
