import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.GROQ_API_KEY;

        console.log("GROQ KEY EXISTS:", !!apiKey);

        if (!apiKey) {
            throw new Error("Groq API key missing");
        }

        const groq = new Groq({ apiKey });

        const { prompt } = await req.json();

        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "user",
                    content: `Generate a playlist of 10 songs for: ${prompt}.
Return ONLY JSON:
[
  { "title": "...", "artist": "...", "mood": "..." }
]`,
                },
            ],
        });

        const text = completion.choices[0]?.message?.content || "";

        console.log("RAW:", text);

        let parsed: any[] = [];

        try {
            const cleanText = text.substring(
                text.indexOf("["),
                text.lastIndexOf("]") + 1
            );

            parsed = JSON.parse(cleanText);
        } catch (err) {
            console.log("JSON ERROR:", text);
        }

        return NextResponse.json({ playlist: parsed });

    } catch (error: any) {
        console.error("ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}