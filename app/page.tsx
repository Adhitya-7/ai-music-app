"use client";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentSong, setCurrentSong] = useState<any>(null);

  const generate = async () => {
    if (!prompt) return;
    setLoading(true);

    try {
      const res = await fetch("/api/playlist", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setPlaylist(data.playlist || []);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-black text-white">

      {/* Sidebar */}
      <div className="w-64 bg-neutral-900 p-6 hidden md:flex flex-col">
        <h2 className="text-xl font-bold mb-6">AI Music</h2>

        <ul className="space-y-4 text-gray-400">
          <li className="hover:text-white cursor-pointer">Browse</li>
          <li className="hover:text-white cursor-pointer">Playlists</li>
          <li className="hover:text-white cursor-pointer">Favorites</li>
        </ul>

        <div className="mt-auto text-xs text-gray-500">
          Built by Luffy 🚀
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-6 overflow-y-auto pb-24">

        <h1 className="text-3xl font-bold mb-6">AI Music 🎧</h1>

        {/* Input */}
        <div className="flex gap-3 mb-6">
          <input
            className="bg-neutral-800 p-3 rounded w-full outline-none focus:ring-2 ring-white/20"
            placeholder="Late night rain drive..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            onClick={generate}
            className="bg-white text-black px-5 rounded hover:scale-105 transition"
          >
            Generate
          </button>
        </div>

        {loading && <p className="text-gray-400">Generating...</p>}

        {/* Playlist */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {playlist.map((song, i) => (
            <div
              key={i}
              onClick={() => setCurrentSong(song)}
              className="bg-neutral-900/70 backdrop-blur-lg p-4 rounded-xl hover:bg-neutral-800 transition cursor-pointer hover:scale-105"
            >
              <img
                src={`https://source.unsplash.com/300x300/?music,album&sig=${i}`}
                className="rounded-lg mb-3"
              />

              <p className="font-semibold truncate">{song.title}</p>
              <p className="text-sm text-gray-400 truncate">
                {song.artist}
              </p>
              <p className="text-xs text-gray-500">{song.mood}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🎧 PLAYER */}
      <div className="fixed bottom-0 left-0 w-full h-24 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between px-6">

        {currentSong ? (
          <>
            <div>
              <p className="text-sm text-gray-400">Now Playing</p>
              <p className="text-white font-semibold">
                {currentSong.title}
              </p>
              <p className="text-xs text-gray-500">
                {currentSong.artist}
              </p>
            </div>

            <div className="flex gap-6 text-xl">
              <button>⏮</button>
              <button>▶</button>
              <button>⏭</button>
            </div>

            {/* YouTube Embed */}
            <iframe
              className="hidden"
              src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(
                currentSong.title + " " + currentSong.artist
              )}`}
            />
          </>
        ) : (
          <p className="text-gray-400">Select a song</p>
        )}
      </div>

    </div>
  );
}