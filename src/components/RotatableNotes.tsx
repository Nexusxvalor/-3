import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export interface NoteProps {
  note: { text: string; color: string; borderColor: string };
  index: number;
}

const RotatableNote: React.FC<NoteProps> = memo(({ note, index }) => {
  const [isRotated, setIsRotated] = useState(false);

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      style={{
        perspective: "1000px",
        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
        willChange: 'transform'
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onClick={() => setIsRotated(!isRotated)}
    >
      <motion.div
        className={`relative w-full h-full min-h-[140px] rounded-2xl shadow-xl border-2 ${note.borderColor}`}
        animate={{ rotateY: isRotated ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          transformStyle: "preserve-3d",
          willChange: 'transform'
        }}
      >
        {/* Front Face */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${note.color} p-6 rounded-2xl flex flex-col items-center justify-center`}
          style={{
            backfaceVisibility: "hidden",
          }}
        >
          <p className="font-comic text-gray-800 text-center font-semibold leading-relaxed text-lg">
            {note.text}
          </p>

          {/* Tape effect */}
          <div
            className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-12 h-6 bg-yellow-200/70 rounded-sm shadow-sm border border-yellow-300/50"
            style={{ clipPath: "polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)" }}
          />

          {/* Click hint */}
          <div className="absolute bottom-2 right-2 text-xs text-gray-500 opacity-60">
            Click me!
          </div>
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-pink-100 to-pink-200 p-6 rounded-2xl flex flex-col items-center justify-center"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          <Heart
            className="w-8 h-8 text-red-500 mx-auto mb-2"
            fill="currentColor"
          />
          <p className="font-comic text-gray-700 font-medium">
            Made with love 💕
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
});

export default RotatableNote;
