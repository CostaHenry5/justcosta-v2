import { NextResponse } from "next/server";

const STG_SOURCE = "Tanzania Ministry of Health, Standard Treatment Guidelines and National Essential Medicines List for Tanzania Mainland, Seventh Edition (2026).";

const CLINICAL_ASSISTANT_INSTRUCTIONS = [
  "You are a patient-facing health-visit preparation assistant.",
  "Use only the provided Tanzania guideline excerpts for condition-specific information.",
  "You are not a doctor and must not diagnose, prescribe medication, give dosing, recommend a treatment plan, or claim certainty.",
  "Discuss only possible causes or concerns to raise with a qualified clinician.",
  "Always state that the response is general information, not a diagnosis.",
  "Encourage urgent or emergency care immediately for trouble breathing, chest pain, stroke-like symptoms, severe bleeding, loss of consciousness, seizure, severe allergic reaction, or imminent self-harm.",
  "For non-emergency concerns, advise care from a qualified clinician at the nearest appropriate hospital or health facility.",
  "Do not offer medication changes, treatment instructions, or unsupported claims.",
  "If excerpts are not clearly relevant, say so and advise speaking with a clinician instead of guessing.",
  "Keep the response concise, calm, and supportive.",
  "End with: Guideline source: Tanzania Ministry of Health STG-NEMLIT, Seventh Edition (2026).",
].join("\n");

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  const vectorStoreId = process.env.OPENAI_VECTOR_STORE_ID;

  if (!apiKey || !vectorStoreId) {
    return NextResponse.json({ error: "The AI assistant is not configured yet. Please try again later." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const age = typeof body.age === "string" ? body.age.trim() : "";
    const location = typeof body.location === "string" ? body.location.trim() : "";
    const symptoms = typeof body.symptoms === "string" ? body.symptoms.trim() : "";
    const duration = typeof body.duration === "string" ? body.duration.trim() : "";
    const concerns = typeof body.concerns === "string" ? body.concerns.trim() : "";

    if (!age || !symptoms || !duration) {
      return NextResponse.json({ error: "Please add the patient age, symptoms, and when they began." }, { status: 400 });
    }

    if (age.length + location.length + symptoms.length + duration.length + concerns.length > 6000) {
      return NextResponse.json({ error: "Please shorten your notes and try again." }, { status: 400 });
    }

    const searchQuery = [
      "Patient age: " + age,
      "Broad location (region, district, or ward): " + (location || "Not provided"),
      "Symptoms or concerns: " + symptoms,
      "When it began or changed: " + duration,
      "Questions or worries: " + (concerns || "None provided"),
    ].join("\n");

    const searchResponse = await fetch("https://api.openai.com/v1/vector_stores/" + vectorStoreId + "/search", {
      method: "POST",
      headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ query: searchQuery, max_num_results: 4, rewrite_query: true }),
    });
    const searchData = await searchResponse.json();

    if (!searchResponse.ok) {
      console.error("Guideline search failed", searchData);
      return NextResponse.json({ error: "The guideline library could not be searched right now. Please try again later." }, { status: 502 });
    }

    const guidelineExcerpts = Array.isArray(searchData.data)
      ? searchData.data.slice(0, 4).map((result: { content?: Array<{ text?: string }> }) =>
          Array.isArray(result.content) ? result.content.map((item) => item.text || "").filter(Boolean).join("\n") : ""
        ).filter(Boolean).join("\n\n---\n\n")
      : "";

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-5.4",
        store: false,
        max_output_tokens: 450,
        instructions: CLINICAL_ASSISTANT_INSTRUCTIONS,
        input: ["Patient notes:", searchQuery, "", "Tanzania guideline excerpts:", guidelineExcerpts || "No clearly relevant excerpts were found. Do not guess."].join("\n"),
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI request failed", data);
      return NextResponse.json({ error: "The AI service could not respond right now. Please try again later." }, { status: 502 });
    }

    const guidance = Array.isArray(data.output)
      ? data.output
          .filter((item: { type?: string }) => item.type === "message")
          .flatMap((item: { content?: Array<{ type?: string; text?: string }> }) => item.content || [])
          .filter((part: { type?: string }) => part.type === "output_text")
          .map((part: { text?: string }) => part.text || "")
          .join("\n")
          .trim()
      : "";

    if (!guidance) {
      console.error("OpenAI response did not contain output text", data);
      return NextResponse.json({ error: "The AI service returned no guidance. Please try again later." }, { status: 502 });
    }

    return NextResponse.json({ guidance, source: STG_SOURCE });
  } catch (error) {
    console.error("Clinical assistant error", error);
    return NextResponse.json({ error: "Something went wrong. Please try again later." }, { status: 500 });
  }
}
