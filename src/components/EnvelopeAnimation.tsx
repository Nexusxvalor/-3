import React, { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import EnvelopeGif from "../images/intro.gif";
import { textConfig } from "../textConfig";
import SplashBackground from "./SplashBackground";
import BackgroundAnimation from "../components/SplashBackground"

interface EnvelopeAnimationProps {
  onOpenComplete: () => void;
}

const EnvelopeAnimation: React.FC<EnvelopeAnimationProps> = memo(({ onOpenComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => setShowEnvelope(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleEnvelopeClick = useCallback(() => {
    if (!isOpen) {
      setIsOpen(true);
      setTimeout(() => setShowLetter(true), 600);
      setTimeout(() => onOpenComplete(), 2000);
    }
  }, [isOpen, onOpenComplete]);

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-rose-50 to-pink-100 relative overflow-hidden px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <SplashBackground />
      <BackgroundAnimation />
      <AnimatePresence mode="wait">
        {showEnvelope && (
          <motion.div
            className="cursor-pointer relative z-20"
            onClick={handleEnvelopeClick}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
            whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
          >
            {!shouldReduceMotion && (
              <motion.div
                className="absolute -top-36 left-1/2 transform -translate-x-1/2 w-44 h-44 z-30"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: [-15, 5, -15], opacity: 1 }}
                transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse" }}
              >
                <img
                  src={EnvelopeGif}
                  alt="Flying hearts"
                  className="w-full h-full object-contain"
                  style={{ pointerEvents: "none" }}
                />
              </motion.div>
            )}

            {/* Envelope Body */}
            <motion.div
              className="relative w-80 h-56 sm:w-[360px] sm:h-[260px] md:w-[420px] md:h-[280px] bg-gradient-to-br from-white via-rose-50 to-pink-100 border-3 border-rose-300 rounded-2xl shadow-2xl overflow-hidden"
              animate={isOpen ? { scale: 0.95, opacity: 0.7 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #fdf2f8 50%, #fce7f3 100%)",
                boxShadow:
                  "0 25px 50px rgba(236, 72, 153, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
              }}
            >
              {/* Flap */}
              <motion.div
                className="absolute top-0 left-0 right-0 w-0 h-0 border-l-[160px] border-r-[160px] border-t-[112px] sm:border-l-[180px] sm:border-r-[180px] sm:border-t-[130px] md:border-l-[210px] md:border-r-[210px] md:border-t-[140px] border-l-transparent border-r-transparent"
                initial={{ rotateX: 0 }}
                animate={isOpen ? { rotateX: -180 } : { rotateX: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{
                  transformOrigin: "top",
                  borderTopColor: "#f43f5e",
                  filter: "drop-shadow(0 4px 6px rgba(244, 63, 94, 0.3))",
                }}
              />

              {/* Wax Seal */}
              <motion.div
                className="absolute top-[45%] left-1/2 -translate-x-1/2 bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 rounded-full p-3 md:p-4 shadow-xl border-2 border-white"
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.15, rotate: 5 }}
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, #fb7185, #ec4899, #e11d48)",
                }}
              >
                <Heart className="w-6 h-6 md:w-7 md:h-7 text-white" fill="currentColor" />
              </motion.div>

              {/* Letter inside */}
              {showLetter && (
                <motion.div
                  className="absolute inset-x-3 top-3 h-[200px] bg-gradient-to-br from-white via-rose-25 to-pink-50 rounded-xl shadow-2xl p-5 text-center border-2 border-rose-100"
                  initial={{ y: 250, opacity: 0, scale: 0.8, rotateX: 45 }}
                  animate={{ y: -25, opacity: 1, scale: 1, rotateX: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut", type: "spring", bounce: 0.3 }}
                >
                  <div className="flex items-center justify-center mb-3">
                    <Heart className="w-5 h-5 text-rose-500 mr-2" fill="currentColor" />
                    <p className="text-base text-gray-700 font-comic font-semibold">
                      {textConfig.ui.envelopePreview}
                    </p>
                    <Heart className="w-5 h-5 text-rose-500 ml-2" fill="currentColor" />
                  </div>
                </motion.div>
              )}
            </motion.div>

            {!isOpen && (
              <motion.div
                className="text-rose-700 text-sm md:text-lg font-medium text-center mt-6 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border-2 border-rose-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: [0, 1, 0.8, 1],
                  y: [10, 0, -2, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                ✨ {textConfig.ui.envelopeHint} ✨
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default EnvelopeAnimation;
