// Intervu AI: generates interview questions and scores HR answer
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

async function callAI(body: unknown) {
  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) throw new Error("LOVABLE_API_KEY missing");
  const r = await fetch(AI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`AI ${r.status}: ${t}`);
  }
  return r.json();
}

function extractTool(json: any) {
  const args = json?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  if (!args) throw new Error("No tool call in AI response");
  return JSON.parse(args);
}

const generateTool = {
  type: "function",
  function: {
    name: "intervu_questions",
    description: "Generate fresh interview questions for a fresher.",
    parameters: {
      type: "object",
      properties: {
        hr_question: {
          type: "string",
          description: "One open HR/behavioral question, 1 sentence.",
        },
        aptitude: {
          type: "array",
          description: "Exactly 4 aptitude MCQs (mix of Quant, Logical, Verbal).",
          items: {
            type: "object",
            properties: {
              category: { type: "string", enum: ["Quant", "Logical", "Verbal"] },
              question: { type: "string" },
              options: {
                type: "array",
                items: { type: "string" },
                minItems: 4,
                maxItems: 4,
              },
              answer_index: { type: "integer", minimum: 0, maximum: 3 },
            },
            required: ["category", "question", "options", "answer_index"],
            additionalProperties: false,
          },
        },
        logic: {
          type: "object",
          properties: {
            question: { type: "string" },
            options: {
              type: "array",
              items: { type: "string" },
              minItems: 4,
              maxItems: 4,
            },
            answer_index: { type: "integer", minimum: 0, maximum: 3 },
          },
          required: ["question", "options", "answer_index"],
          additionalProperties: false,
        },
      },
      required: ["hr_question", "aptitude", "logic"],
      additionalProperties: false,
    },
  },
};

const scoreTool = {
  type: "function",
  function: {
    name: "score_hr_answer",
    description: "Score and analyze a fresher's HR interview answer.",
    parameters: {
      type: "object",
      properties: {
        score: { type: "integer", minimum: 0, maximum: 100 },
        strengths: { type: "array", items: { type: "string" } },
        weaknesses: { type: "array", items: { type: "string" } },
        tips: { type: "array", items: { type: "string" } },
      },
      required: ["score", "strengths", "weaknesses", "tips"],
      additionalProperties: false,
    },
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { action, stream, hr_question, hr_answer } = await req.json();

    if (action === "generate") {
      const json = await callAI({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "You generate fresh, varied interview questions for Indian college freshers preparing for placements. Tailor difficulty for entry-level. Avoid repeating common questions.",
          },
          {
            role: "user",
            content: `Generate a new HR question, 4 aptitude MCQs (mix Quant/Logical/Verbal), and 1 logical reasoning MCQ for a ${stream || "general"} student. Make them realistic and varied.`,
          },
        ],
        tools: [generateTool],
        tool_choice: { type: "function", function: { name: "intervu_questions" } },
      });
      return new Response(JSON.stringify(extractTool(json)), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "score") {
      const json = await callAI({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are an expert HR interviewer scoring a fresher's answer. Be honest, constructive, and specific. Score 0-100 based on clarity, structure (STAR), relevance, and confidence.",
          },
          {
            role: "user",
            content: `Question: ${hr_question}\n\nCandidate answer: ${hr_answer}\n\nScore and give 2-3 strengths, 2-3 weaknesses, and 2-3 actionable tips.`,
          },
        ],
        tools: [scoreTool],
        tool_choice: { type: "function", function: { name: "score_hr_answer" } },
      });
      return new Response(JSON.stringify(extractTool(json)), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    const status = msg.includes("429") ? 429 : msg.includes("402") ? 402 : 500;
    return new Response(JSON.stringify({ error: msg }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
