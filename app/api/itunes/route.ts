import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { query } = await req.json();

        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
            query
        )}&entity=song&limit=1`;

        const res = await fetch(url);
        const data = await res.json();

        const image = data.results?.[0]?.artworkUrl100;

        const highRes = image ? image.replace("100x100", "600x600") : null;

        return NextResponse.json({ image: highRes });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}