import { NextResponse } from "next/server";

const CLINICAL_ASSISTANT_INSTRUCTIONS = `
You are a patient-facing health-visit preparation assistant.
You are not a doctor and must not diagnose, prescribe medication, give dosing, or claim certainty.
Give calm, plain-language, general information that helps a patient prepare to speak with a qualified clinician.

Always:
- State that your response is general information, not a diagnosis.
- Encourage urgent or emergency care immediately for trouble breathing, chest pain, stroke-like symptoms, severe bleeding, loss of consciousness, seizure, severe allergic reaction, or imminent self-harm.
- For non-emergency concerns, suggest the type of clinician or service to contact and useful questions to ask.
- Avoid medication changes, treatment instructions, or guessing a specific condition.
- Keep the response concise and supportive.
`;

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "The AI assistant is not configured yet. Please try again later." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const symptoms = typeof body.symptoms === "string" ? body.symptoms.trim() : "";
    const duration = typeof body.duration === "string" ? body.duration.trim() : "";
    const concerns = typeof body.concerns === "string" ? body.concerns.trim() : "";

    if (!symptoms || !duration) {
      return NextResponse.json({ error: "Please add your symptoms and when they began." }, { status: 400 });
    }

    if (symptoms.length + duration.length + concerns.length > 6000) {
      return NextResponse.json({ error: "Please shorten your notes and try again." }, { status: 400 });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5.4",
        store: false,
        max_output_tokens: 450,
        instructions: CLINICAL_ASSISTANT_INSTRUCTIONS,
        input: `Patient notes:\nSymptoms or concerns: ${symptoms}\nWhen it began or changed: ${duration}\nQuestions or worries: ${concerns || "None provided"}`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI request failed", data);
      return NextResponse.json({ error: "The AI service could not respond right now. Please try again later." }, { status: 502 });
    }

    return NextResponse.json({ guidance: data.output_text || "No guidance was returned. Please speak with a qualified clinician." });
  } catch (error) {
    console.error("Clinical assistant error", error);
    return NextResponse.json({ error: "Something went wrong. Please try again later." }, { status: 500 });
  }
}
