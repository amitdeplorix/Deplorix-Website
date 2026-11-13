// Project Advisor — turns a plain-language project description into a tailored
// division recommendation and short project brief.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const CATALOGUE = `
tech | Deplorix Tech | Websites, Apps & Software — Built and Shipped
  - Websites & Landing Pages
  - Web Applications & Internal Tools
  - Mobile App Development
  - Custom Software & Integrations
  - Maintenance & Feature Development

digital | Deplorix Digital | Marketing & Personal Branding That Gets Noticed
  - Social Media Management
  - Personal Branding for Founders
  - Performance Marketing
  - Brand Identity Design
  - Content Creation

projects | Deplorix Projects | Practical Project Delivery for Students (final-year and academic projects)
  - Final-Year Project Development
  - Documentation & Reports
  - One-on-One Mentorship
  - Viva & Review Preparation

bps | Deplorix Business Process Solutions | Dedicated Support Teams, Managed End-to-End
  - Customer Support
  - Technical Support
  - Sales Support
  - Back-Office & Data Processes
  - Dedicated Managed Seats

training | Deplorix Training | Building the Workforce Our Other Divisions Run On
  - Job-Readiness & Communication
  - Process & Tools Upskilling
  - Certification Pathways
  - Corporate Training
`;

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "divisionId",
    "divisionReason",
    "recommendedServices",
    "goals",
    "scope",
    "phases",
    "timeline",
    "nextStep",
    "briefText",
  ],
  properties: {
    divisionId: { type: "string", enum: ["tech", "digital", "projects", "bps", "training"] },
    divisionReason: { type: "string" },
    recommendedServices: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "why"],
        properties: {
          title: { type: "string" },
          why: { type: "string" },
        },
      },
    },
    goals: { type: "array", items: { type: "string" } },
    scope: { type: "array", items: { type: "string" } },
    phases: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "detail", "duration"],
        properties: {
          name: { type: "string" },
          detail: { type: "string" },
          duration: { type: "string" },
        },
      },
    },
    timeline: { type: "string" },
    nextStep: { type: "string" },
    briefText: { type: "string" },
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description, audience, budget, timeline } = await req.json().catch(() => ({}));

    if (typeof description !== "string" || description.trim().length < 20) {
      return Response.json(
        { error: "Please describe your project in at least 20 characters." },
        { status: 400, headers: corsHeaders },
      );
    }

    const apiKey = Deno.env.get("AI_API_KEY") || Deno.env.get("OPENAI_API_KEY");

    const instructions = `You are the project advisor for DeploriX Technologies, a software and digital services company in Bangalore, India.
Recommend ONLY from this catalogue of divisions and sub-services; never invent a service:
${CATALOGUE}
Pick exactly one best-fit division id and 2-4 sub-services copied verbatim from that division's list.
Write in plain, warm, confident British-Indian business English. Be concrete and short: goals and scope as 3-5 crisp bullet lines each, 3-4 phases with realistic durations, one overall timeline estimate (e.g. "6-8 weeks").
briefText is a clean plain-text project brief the client can send to us by email, no markdown symbols.
Never quote prices.`;

    const userInput = [
      `Project description: ${description.trim()}`,
      audience ? `Who they are: ${audience}` : "",
      budget ? `Budget range: ${budget}` : "",
      timeline ? `Desired timeline: ${timeline}` : "",
      "Respond with the structured json brief.",
    ]
      .filter(Boolean)
      .join("\n");

    const apiUrl = Deno.env.get("AI_API_URL") || "https://api.openai.com/v1/chat/completions";

    if (!apiKey) {
      return Response.json(
        { error: "AI Advisor is currently in maintenance. Please submit your request directly via the form." },
        { status: 503, headers: corsHeaders },
      );
    }

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: instructions },
          { role: "user", content: userInput },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "project_brief",
            strict: true,
            schema: SCHEMA,
          },
        },
      }),
    });

    if (!res.ok) {
      return Response.json(
        { error: "We couldn't generate your brief just now. Please try again." },
        { status: res.status, headers: corsHeaders },
      );
    }

    const result = await res.json();
    const content = result.choices?.[0]?.message?.content;
    const brief = typeof content === "string" ? JSON.parse(content) : content;

    return Response.json({ brief }, { headers: corsHeaders });
  } catch (err) {
    console.error("project-advisor failed", err);
    return Response.json(
      { error: "Something went wrong generating your brief. Please try again." },
      { status: 500, headers: corsHeaders },
    );
  }
});
