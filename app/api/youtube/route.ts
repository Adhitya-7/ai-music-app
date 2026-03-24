import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { query } = await req.json();

        const apiKey = process.env.YOUTUBE_API_KEY;

        console.log("YT KEY EXISTS:", !!apiKey);

        if (!apiKey) {
            throw new Error("YouTube API key missing");
        }

        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            query + " official audio"
        )}&type=video&maxResults=1&key=${apiKey}`;

        const res = await fetch(url);
        const data = await res.json();

        console.log("YT RESPONSE:", data);

        const videoId = data.items?.[0]?.id?.videoId;
        const thumbnail = data.items?.[0]?.snippet?.thumbnails?.high?.url || data.items?.[0]?.snippet?.thumbnails?.default?.url;

        if (!videoId) {
            throw new Error("No video found");
        }

        return NextResponse.json({
            videoId,
            thumbnail,
        });

    } catch (error: any) {
        console.error("YOUTUBE ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}