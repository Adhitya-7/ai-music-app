"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 🔥 Generate playlist
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

  // 🔥 Play a song
  const playSong = async (index: number) => {
    if (index < 0 || index >= playlist.length) return;

    setCurrentIndex(index);
    setIsPlaying(true);

    const song = playlist[index];

    try {
      const res = await fetch("/api/youtube", {
        method: "POST",
        body: JSON.stringify({
          query: song.title + " " + song.artist + " official audio",
        }),
      });

      const data = await res.json();
      setVideoId(data.videoId);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 Next / Prev
  const nextSong = () => {
    if (currentIndex !== null) {
      playSong(currentIndex + 1);
    }
  };

  const prevSong = () => {
    if (currentIndex !== null) {
      playSong(currentIndex - 1);
    }
  };

  // 🔥 Auto next
  useEffect(() => {
    if (!videoId) return;

    const timer = setTimeout(() => {
      nextSong();
    }, 30000); // ~30 sec fallback

    return () => clearTimeout(timer);
  }, [videoId]);

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
      <div className="flex-1 p-6 overflow-y-auto pb-28">

        <h1 className="text-3xl font-bold mb-6">AI Music 🎧</h1>

        {/* Input */}
        <div className="flex gap-3 mb-6">
          <input
            className="bg-neutral-800 p-3 rounded w-full outline-none"
            placeholder="Late night drive..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            onClick={generate}
            className="bg-white text-black px-5 rounded"
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
              onClick={() => playSong(i)}
              className="bg-neutral-900 p-4 rounded-xl hover:bg-neutral-800 cursor-pointer"
            >
              <img
                src={`https://source.unsplash.com/300x300/?music&sig=${i}`}
                className="rounded mb-2"
              />

              <p className="font-semibold truncate">{song.title}</p>
              <p className="text-sm text-gray-400">{song.artist}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PLAYER */}
      <div className="fixed bottom-0 left-0 w-full h-24 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between px-6">

        {currentIndex !== null ? (
          <>
            <div>
              <p className="text-sm text-gray-400">Now Playing</p>
              <p className="font-semibold">
                {playlist[currentIndex]?.title}
              </p>
              <p className="text-xs text-gray-500">
                {playlist[currentIndex]?.artist}
              </p>
            </div>

            <div className="flex gap-6 text-xl items-center">
              <button onClick={prevSong}>⏮</button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-2xl"
              >
                {isPlaying ? "⏸" : "▶"}
              </button>

              <button onClick={nextSong}>⏭</button>
            </div>

            {/* YouTube Player */}
            {videoId && (
              <iframe
                width="0"
                height="0"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0
                  }`}
                allow="autoplay"
              />
            )}
          </>
        ) : (
          <p className="text-gray-400">Select a song</p>
        )}
      </div>

    </div>
  );
}
