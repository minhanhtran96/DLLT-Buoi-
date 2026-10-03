import { FALLBACK_ANSWER, systemInstruction } from "@/lib/qna";

// Model đầu hay quá tải (503), nên có model dự phòng.
const MODELS = ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-3.1-flash-lite"];

interface ChatTurn {
  from: "bot" | "user";
  text: string;
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Thiếu GEMINI_API_KEY" }, { status: 500 });
  }

  const { messages } = (await request.json()) as { messages?: ChatTurn[] };
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "Thiếu nội dung" }, { status: 400 });
  }

  // Gemini yêu cầu lượt đầu là của user, nên bỏ lời chào ban đầu của bot.
  const firstUser = messages.findIndex((m) => m.from === "user");
  const contents = messages.slice(firstUser).map((m) => ({
    role: m.from === "user" ? "user" : "model",
    parts: [{ text: String(m.text).slice(0, 1000) }],
  }));

  let res: Response | undefined;
  for (const model of MODELS) {
    res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: { temperature: 0 },
        }),
      },
    );
    if (res.ok || ![429, 500, 503].includes(res.status)) break;
    console.error("Gemini", model, res.status, "- thử model khác");
  }

  if (!res?.ok) {
    console.error("Gemini error", res?.status, await res?.text());
    return Response.json({ error: "Gemini lỗi" }, { status: 502 });
  }

  const data = await res.json();
  const answer: string | undefined = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return Response.json({ answer: answer?.trim() || FALLBACK_ANSWER });
}
