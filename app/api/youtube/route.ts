import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { query } = await req.json();

        console.log("Searching YouTube for:", query);

        const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

        const res = await fetch(url);
        const text = await res.text();

        const match = text.match(/"videoId":"(.*?)"/);

        if (!match) {
            return NextResponse.json({ error: "No video found" }, { status: 404 });
        }

        const videoId = match[1];

        console.log("VIDEO ID:", videoId);

        return NextResponse.json({ videoId });

    } catch (error) {
        console.error("YOUTUBE ERROR:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}