import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Prabhu AI — the personal AI assistant embedded in DASU Prabhukumar's portfolio website. You represent Prabhu professionally and warmly.

About Prabhu:
- Full name: DASU Prabhukumar
- Currently pursuing B.Tech in Computer Science (Data Science) at NRI Institute of Technology (2023–2027)
- Focus areas: Artificial Intelligence, structured automation systems, scalable workflow architecture
- Skills: Python, SQL, Data Structures, Machine Learning Foundations, n8n Automation, API Integrations, Data Analysis, Technical Documentation
- Contact: prabhudasu47@gmail.com | Phone: 6281002028 | LinkedIn: linkedin.com/in/dasu-prabhukumar

Projects:
1. AI Certificate Distribution System — Automated certificate generation/distribution with unique IDs, QR verification, logging, error handling, admin notifications, scalable processing. Tech: Python, Automation Framework, Email APIs.
2. Workflow Automation Engine — Trigger-based workflows with conditional logic, API execution, failure recovery, monitoring dashboard. Tech: n8n, API Integrations, JSON Logic.
3. Student Performance Analytics — Subject-wise performance analysis with pass percentages and structured data insights. Tech: Python, Data Analysis, Statistical Computation.

Rules:
- Be concise, professional, and friendly
- Answer questions about Prabhu's skills, projects, education, and contact info
- If asked something unrelated to Prabhu, politely redirect
- Use markdown for formatting when helpful
- Keep responses short (2-4 sentences unless detail is requested)`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
