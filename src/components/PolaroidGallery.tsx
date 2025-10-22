import React, { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { textConfig } from "../textConfig";

const PolaroidGallery: React.FC = memo(() => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative bg-gradient-to-br from-white via-amber-50 to-orange-50 p-8 md:p-10 text-center rounded-3xl shadow-2xl border-2 border-amber-200 overflow-hidden"
      whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
    >
      <div className="bg-gradient-to-br from-amber-100 to-orange-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 shadow-lg border-4 border-white">
        <span className="text-2xl">🖼️</span>
      </div>

      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 font-comic mb-3">
          {textConfig.gallery.title}
        </h2>
        <p className="text-gray-600 font-comic text-xl leading-relaxed mb-6">
          {textConfig.gallery.subtitle}
        </p>

        <div className="relative overflow-hidden rounded-2xl">
          <div className="flex gap-6 overflow-x-auto scroll-smooth pb-4 no-scrollbar">
            {textConfig.gallery.photos.map((photo, index) => (
              <motion.div
                key={index}
                className="flex-none w-72 sm:w-80 bg-white p-4 rounded-xl transform"
                style={{
                  transform: `rotate(${(index % 2 === 0 ? 1 : -1) * (Math.random() * 3 + 1)}deg)`,
                }}
                whileHover={shouldReduceMotion ? {} : { scale: 1.05, rotate: 0 }}
              >
                <div className="relative bg-gray-100 rounded-lg flex items-center justify-center">
                  <img
                    src={photo.src}
                    alt={`Memory ${index + 1}`}
                    className="w-full aspect-[4/5] object-contain rounded-lg"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md">
                    <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="font-comic text-gray-700 text-lg font-medium leading-relaxed">
                    {photo.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: textConfig.scrollIndicators }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-amber-300 opacity-60" />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default PolaroidGallery;
