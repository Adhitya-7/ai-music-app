"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [savedSongs, setSavedSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);

  // Load saved songs
  useEffect(() => {
    const saved = localStorage.getItem("savedSongs");
    if (saved) {
      setSavedSongs(JSON.parse(saved));
    }
  }, []);

  // Generate playlist
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

  // Save song
  const saveSong = (song: any) => {
    const exists = savedSongs.find(
      (s) => s.title === song.title && s.artist === song.artist
    );
    if (exists) return;

    const updated = [...savedSongs, song];
    setSavedSongs(updated);
    localStorage.setItem("savedSongs", JSON.stringify(updated));
  };

  // Play song
  const playSong = async (index: number) => {
    setCurrentIndex(index);

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

      // 🔥 iTunes fetch (ONLY ONCE)
      const itunesRes = await fetch("/api/itunes", {
        method: "POST",
        body: JSON.stringify({
          query: song.title + " " + song.artist + " song",
        }),
      });

      const itunesData = await itunesRes.json();

      // 🔥 SAFE state update
      const updated = [...playlist];
      updated[index] = {
        ...updated[index],
        thumbnail: itunesData.image,
      };

      setPlaylist(updated);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">

      {/* Sidebar */}
      <div className="w-64 bg-neutral-900 p-6 hidden md:flex flex-col">
        <h2 className="text-xl font-bold mb-6">VibeStream 🎧</h2>

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

        <h1 className="text-3xl font-bold mb-6">VibeStream 🎧</h1>

        {/* Input */}
        <div className="flex gap-3 mb-6">
          <input
            className="bg-neutral-800 p-3 rounded w-full"
            placeholder="let's get lit"
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

        {loading && <p>Generating...</p>}

        {/* Playlist */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {playlist.map((song, i) => (
            <motion.div
              key={i}
              onClick={() => playSong(i)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-neutral-900/70 backdrop-blur-lg p-4 rounded-xl cursor-pointer"
            >
              <img
                src={
                  song.thumbnail ||
                  `https://via.placeholder.com/300x300?text=No+Image`
                }
                alt="cover"
                className="rounded mb-2 w-full h-40 object-cover"
              />

              <p className="font-semibold truncate">{song.title}</p>
              <p className="text-sm text-gray-400">{song.artist}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  saveSong(song);
                }}
                className="text-red-400 text-sm mt-2"
              >
                ❤️ Save
              </button>
            </motion.div>
          ))}
        </div>

        {/* Saved Songs */}
        <h2 className="text-xl mt-10 mb-4">Saved Songs ❤️</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {savedSongs.map((song, i) => (
            <div
              key={i}
              onClick={() => playSong(i)}
              className="bg-neutral-800 p-3 rounded cursor-pointer"
            >
              <p className="truncate">{song.title}</p>
              <p className="text-sm text-gray-400">{song.artist}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Player */}
      <div className="fixed bottom-0 left-0 w-full h-28 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between px-6">

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

            {/* YouTube Player */}
            {videoId && (
              <iframe
                className="w-72 h-20 rounded-lg"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`}
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