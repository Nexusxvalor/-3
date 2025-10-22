import React, { useState, useRef, useCallback, useEffect, memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Music, Heart } from "lucide-react";
import { textConfig } from "../textConfig";

interface PlaylistSectionProps {
  onSongChange?: (title: string) => void;
}

const PlaylistSection: React.FC<PlaylistSectionProps> = memo(({ onSongChange }) => {
  const shouldReduceMotion = useReducedMotion();
  const playlistRef = useRef<HTMLDivElement | null>(null);
  const songRefs = useRef<HTMLDivElement[]>([]);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playlist = textConfig.playlist.songs;

  /** 🧹 Cleanup old audio when unmounted */
  useEffect(() => {
    return () => {
      if (currentSong?.audio) {
        currentSong.audio.pause();
        currentSong.audio.src = "";
      }
    };
  }, [currentSong]);

  /** 🎵 Play a specific song */
  const playSong = useCallback(
    (song, index) => {
      if (currentSong?.audio) {
        currentSong.audio.pause();
        currentSong.audio.currentTime = 0;
      }

      const audio = new Audio(song.src);
      audio.preload = "metadata";

      audio.ontimeupdate = () => {
        if (audio.duration) {
          setCurrentProgress((audio.currentTime / audio.duration) * 100);
          setCurrentTime(audio.currentTime);
        }
      };

      audio.onloadedmetadata = () => setDuration(audio.duration);

      audio.onended = () => {
        // Auto move to next when song ends
        const nextIndex = (index + 1) % playlist.length;
        playSong(playlist[nextIndex], nextIndex);
      };

      audio.play().then(() => {
        setCurrentSong({ ...song, audio, index });
        if (onSongChange) onSongChange(song.title);

        // 🌀 Scroll active song into view
        const target = songRefs.current[index];
        if (target && playlistRef.current) {
          target.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
      });
    },
    [currentSong, onSongChange, playlist]
  );

  /** ⏸ Stop playback */
  const stopSong = useCallback(() => {
    if (currentSong?.audio) {
      currentSong.audio.pause();
      currentSong.audio.currentTime = 0;
    }
    setCurrentSong(null);
    setCurrentProgress(0);
    setCurrentTime(0);
  }, [currentSong]);

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  /** 💿 Main UI */
  return (
    <motion.div
      className="relative bg-gradient-to-br from-white via-blue-50 to-indigo-50 p-6 md:p-8 text-center rounded-3xl shadow-2xl border-2 border-blue-200 overflow-hidden"
      whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
    >
      {/* Header */}
      <div className="flex items-center justify-center mb-8">
        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 border-white mr-4">
          <Music className="w-8 h-8 text-blue-600" />
        </div>
        <div className="text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-comic">
            {textConfig.playlist.title}
          </h2>
          <p className="text-gray-600 font-comic text-lg">{textConfig.playlist.subtitle}</p>
        </div>
      </div>

      {/* Playlist container */}
      <div className="relative">
        <div
          ref={playlistRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-4 px-2 no-scrollbar"
        >
          {playlist.map((song, index) => (
            <motion.div
              ref={(el) => (songRefs.current[index] = el!)}
              key={index}
              className={`flex-none w-72 bg-white/90 backdrop-blur-sm rounded-2xl border transition-all duration-300 overflow-hidden ${
                currentSong?.index === index
                  ? "border-blue-400 bg-blue-50/90 scale-105"
                  : "border-gray-200 hover:border-blue-300 hover:scale-105"
              }`}
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
            >
              {/* Album Art */}
              <div className="relative bg-gray-100 flex items-center justify-center p-3">
                <img
                  src={song.cover}
                  alt={`${song.title} cover`}
                  className="w-full aspect-square object-contain rounded-xl"
                />

                {currentSong?.index === index && (
                  <motion.div
                    className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <div className="flex items-center space-x-1">
                      <motion.div
                        className="w-2 h-2 bg-white rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <span>Now Playing</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Song Info */}
              <div className="p-4 text-center">
                <h3 className="font-comic text-gray-900 font-bold text-lg mb-1 truncate">
                  {song.title}
                </h3>
                <p className="font-comic text-gray-600 text-sm mb-4">{song.info}</p>

                {/* Progress bar */}
                {currentSong?.index === index ? (
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden mb-2">
                      <motion.div
                        className="bg-blue-500 h-1 rounded-full"
                        style={{ width: `${currentProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 h-[30px]" />
                )}

                {/* Controls */}
                <div className="flex items-center justify-center space-x-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-3 border border-gray-200">
                  {/* Prev */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!currentSong) return;
                      const prev = currentSong.index > 0
                        ? currentSong.index - 1
                        : playlist.length - 1;
                      playSong(playlist[prev], prev);
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-white transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                    </svg>
                  </motion.button>

                  {/* Play/Pause */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (currentSong?.index === index) stopSong();
                      else playSong(song, index);
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg ${
                      currentSong?.index === index
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-blue-400 hover:bg-blue-500"
                    }`}
                  >
                    {currentSong?.index === index ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </motion.button>

                  {/* Next */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!currentSong) return;
                      const next =
                        currentSong.index < playlist.length - 1
                          ? currentSong.index + 1
                          : 0;
                      playSong(playlist[next], next);
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-white transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scroll Indicators */}
        <div className="flex justify-center mt-6 space-x-2">
          {playlist.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full cursor-pointer transition-all ${
                currentSong?.index === index
                  ? "bg-blue-500 w-8"
                  : "bg-blue-300 w-2 hover:bg-blue-400"
              }`}
              onClick={() => playSong(playlist[index], index)}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="flex justify-center items-center mt-8 space-x-2">
        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-blue-300" />
        <Heart className="w-5 h-5 text-pink-400" fill="currentColor" />
        <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-indigo-300" />
      </div>
    </motion.div>
  );
});

export default PlaylistSection;
