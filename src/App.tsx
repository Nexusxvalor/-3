import React, { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Heart, Music, X, Mail, Sparkles } from 'lucide-react';


import ScrollReveal from './components/ScrollReveal';
import HeartCatcherGame from './components/HeartCatcherGame';
import { textConfig } from './textConfig';
import SplashBackground from './components/SplashBackground';
import RotatableNote from './components/RotatableNotes';
import EnvelopeAnimation from './components/EnvelopeAnimation';
import PolaroidGallery from './components/PolaroidGallery';
import PlaylistSection from './components/PlaylistSection';

interface NoteProps {
  note: { text: string; color: string; borderColor: string };
  index: number;
}

// Optimized Floating Hearts Component
const FloatingHearts = memo(({ hearts, onRemove }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {hearts.slice(-10).map((heart) => ( // Limit to 10 hearts max
        <motion.div
          key={heart.id}
          className="absolute pointer-events-none z-40"
          initial={{ scale: 0, opacity: 1, rotate: 0 }}
          animate={shouldReduceMotion ?
            { scale: [1, 0], y: -50, opacity: [1, 0] } :
            { scale: [1, 1.5, 0], y: -100, opacity: [1, 0.8, 0], rotate: [0, 180, 360] }
          }
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: shouldReduceMotion ? 1 : 2, ease: "easeOut" }}
          style={{ left: heart.x - 10, top: heart.y - 10 }}
          onAnimationComplete={() => onRemove(heart.id)}
        >
          <Heart className={`${heart.color} w-6 h-6`} fill="currentColor" />
        </motion.div>
      ))}
    </AnimatePresence>
  );
});

function App() {
  const [showLetter, setShowLetter] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [initialLetterOpened, setInitialLetterOpened] = useState(false);
  const [hasViewedInitialLetter, setHasViewedInitialLetter] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [showGame, setShowGame] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const shouldReduceMotion = useReducedMotion();

  // Add cleanup effect RIGHT HERE inside the App function
  useEffect(() => {
    return () => {
      if (currentSong && currentSong.audio) {
        currentSong.audio.pause();
        currentSong.audio.onended = null;
        currentSong.audio.ontimeupdate = null;
        currentSong.audio.onloadedmetadata = null;
      }
    };
  }, [currentSong]);


  // Throttle heart addition to prevent too many hearts at once
  const lastHeartTime = useRef(0);

  useEffect(() => {
    if (initialLetterOpened && !showContent) {
      const timer = setTimeout(() => setShowContent(true), 800);
      return () => clearTimeout(timer);
    }
  }, [initialLetterOpened, showContent]);


  // Optimized heart adding with throttling
  const addHeart = useCallback((e) => {
    const now = Date.now();
    if (now - lastHeartTime.current < 100) return; // Throttle to 100ms
    lastHeartTime.current = now;

    const newHeart = {
      id: now,
      x: e.clientX,
      y: e.clientY,
      color: ['text-pink-500', 'text-red-400', 'text-purple-500'][Math.floor(Math.random() * 3)]
    };
    setHearts(prev => [...prev.slice(-5), newHeart]); // Reduced to 5 hearts max
  }, []);

  const removeHeart = useCallback((heartId) => {
    setHearts(prev => prev.filter(h => h.id !== heartId));
  }, []);



  // FIX: Main app render logic updated for smooth envelope -> letter -> app transition
  return (
    <AnimatePresence mode="wait">
      {!initialLetterOpened && (
        <EnvelopeAnimation onOpenComplete={() => {
          setInitialLetterOpened(true);
          setShowLetter(true);
        }} />
      )}

      {initialLetterOpened && (
        <motion.div
          key="main-app"
          className="min-h-screen bg-gradient-to-br from-white via-rose-50 to-pink-100 p-4 md:p-8 cursor-pointer relative overflow-hidden"
          onClick={addHeart}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #fdf2f8 25%, #fce7f3 50%, #fbcfe8 75%, #f9a8d4 100%)"
          }}
        >
          <SplashBackground />
          {/* Optimized background animation */}
          {!shouldReduceMotion && (
            <motion.div
              className="fixed inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              {[...Array(3)].map((_, i) => ( // Reduced from 10 to 3
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-pink-100 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    willChange: 'transform, opacity',
                    transform: 'translateZ(0)' // Force GPU layer
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    scale: [0, 0.8, 0], // Reduced scale
                    opacity: [0, 0.2, 0], // Reduced opacity
                  }}
                  transition={{
                    duration: 10 + Math.random() * 5, // Much slower
                    repeat: Infinity,
                    delay: Math.random() * 10 + 3 // Much longer delays
                  }}
                />
              ))}
            </motion.div>
          )}

          {/* Optimized Floating Hearts */}
          <FloatingHearts hearts={hearts} onRemove={removeHeart} />

          {/* Main content with optimized animations */}
          <motion.div
            className="max-w-6xl mx-auto space-y-20 relative z-20"
            // FIX: Main content now waits for the initial letter to be closed
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: hasViewedInitialLetter ? 1 : 0,
              y: hasViewedInitialLetter ? 0 : 20
            }}
            transition={{ duration: 0.8, delay: hasViewedInitialLetter ? 0.3 : 0 }}
          >
            <ScrollReveal animation="fade" duration={0.8} delay={0.5}>
              <motion.div
                className="text-center pt-12"
                whileInView={shouldReduceMotion ? {} : { scale: [0.95, 1] }}
                transition={{ duration: 0.4 }}
              >
                <motion.h1
                  className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4 font-comic"
                >
                  {textConfig.greeting.name},
                </motion.h1>
                <motion.p
                  className="text-xl text-gray-700 font-comic max-w-2xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  {textConfig.greeting.message}
                </motion.p>
              </motion.div>
            </ScrollReveal>

            {/* Optimized Letter Card */}
            <ScrollReveal animation="zoom" duration={0.6} delay={0.1}>
              <motion.div
                className="relative bg-gradient-to-br from-white via-pink-50 to-purple-50 p-4 md:p-10 text-center rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer border-2 border-pink-200 overflow-hidden"
                whileHover={shouldReduceMotion ? {} : {
                  scale: 1.02,
                  boxShadow: "0 25px 50px rgba(236, 72, 153, 0.2)"
                }}
                onClick={(e) => { e.stopPropagation(); setShowLetter(true); }}
              >
                <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-pink-200 to-transparent rounded-full -translate-x-10 -translate-y-10 opacity-50" />
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-purple-200 to-transparent rounded-full translate-x-8 translate-y-8 opacity-50" />

                {!shouldReduceMotion && (
                  <>
                    <motion.div
                      className="absolute top-4 right-4"
                      animate={{ y: [-2, 2, -2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Heart className="w-4 h-4 text-pink-300" fill="currentColor" />
                    </motion.div>
                    <motion.div
                      className="absolute bottom-4 left-4"
                      animate={{ y: [2, -2, 2] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      <Heart className="w-3 h-3 text-purple-300" fill="currentColor" />
                    </motion.div>
                  </>
                )}

                <div className="bg-gradient-to-br from-pink-100 to-purple-100 w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-lg border-4 border-white">
                  <Mail className="w-8 h-8 md:w-10 md:h-10 text-pink-600" />
                </div>

                <div className="relative z-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-2 md:mb-3">
                    {textConfig.letter.title}
                  </h2>
                  <p className="text-gray-600 font-comic text-lg md:text-xl leading-relaxed">{textConfig.letter.subtitle}</p>

                  <div className="flex justify-center items-center mt-3 md:mt-4 space-x-2">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-pink-300" />
                    <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                    <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-purple-300" />
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>

            {/* Polaroid Photo Gallery */}
            <ScrollReveal animation="slide" duration={0.6} delay={0.15}>
              <PolaroidGallery />
            </ScrollReveal>

            {/* Rotatable Notes Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                { text: "You make every day brighter 🌟", color: "from-yellow-100 to-yellow-200", borderColor: "border-yellow-300" },
                { text: "You're my favorite person 💕", color: "from-purple-100 to-purple-200", borderColor: "border-purple-300" },
                { text: "I promise to do better ✨", color: "from-blue-100 to-blue-200", borderColor: "border-blue-300" },
              ].map((note, index) => (
                <RotatableNote key={index} note={note} index={index} />
              ))}
            </div>


            {/* ENHANCED SPOTIFY-STYLE PLAYLIST SECTION */}
            <ScrollReveal animation="slide" duration={0.6} delay={0.2}>
              <PlaylistSection />
            </ScrollReveal>


            {/* Optimized Game Card */}
            <ScrollReveal animation="slide" duration={0.6} delay={0.3}>
              <motion.div
                className="relative bg-gradient-to-br from-white via-purple-50 to-pink-50 p-8 md:p-10 text-center rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer border-2 border-purple-200 overflow-hidden"
                whileHover={shouldReduceMotion ? {} : {
                  scale: 1.02,
                  boxShadow: "0 25px 50px rgba(147, 51, 234, 0.2)"
                }}
                onClick={(e) => { e.stopPropagation(); setShowGame(true); }}
              >
                <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-200 to-transparent rounded-full -translate-x-12 -translate-y-12 opacity-40" />
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-pink-200 to-transparent rounded-full translate-x-10 translate-y-10 opacity-40" />

                {!shouldReduceMotion && (
                  <motion.div
                    className="absolute top-6 right-6"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity }}
                  >
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                  </motion.div>
                )}

                <div className="relative z-10 bg-gradient-to-br from-pink-100 to-purple-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 shadow-lg border-4 border-white">
                  <Heart className="w-10 h-10 text-pink-600" fill="currentColor" />
                </div>

                <div className="relative z-10">
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-comic mb-3">
                    {textConfig.game.title}
                  </h2>
                  <p className="text-gray-600 font-comic text-xl leading-relaxed">{textConfig.game.subtitle}</p>
                  <div className="flex justify-center items-center mt-4 space-x-2">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-purple-300" />
                    <Heart className="w-4 h-4 text-pink-400" fill="currentColor" />
                    <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-pink-300" />
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          </motion.div>

          {/* Optimized Letter Modal */}
          <AnimatePresence>
            {showLetter && (
              <motion.div
                // FIX: Changed background from bg-black/40 to a softer pink
                className="fixed inset-0 bg-pink-100/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                // FIX: Updated onClick to control main content visibility
                onClick={() => {
                  setShowLetter(false);
                  if (!hasViewedInitialLetter) {
                    setHasViewedInitialLetter(true);
                  }
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  className="relative bg-white/95 backdrop-blur-md p-8 md:p-12 max-w-3xl w-full rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] border border-pink-200"
                  initial={{ scale: 0.9, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, type: "spring", bounce: 0.1 }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(254,242,242,0.98) 50%, rgba(252,231,243,0.98) 100%)",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 25px 50px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.6)"
                  }}
                >

                  {/* Enhanced close button */}
                  <motion.button
                    // FIX: Updated onClick to control main content visibility
                    onClick={() => {
                      setShowLetter(false);
                      if (!hasViewedInitialLetter) {
                        setHasViewedInitialLetter(true);
                      }
                    }}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg border border-pink-200 z-20 transition-all duration-200"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 90 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.button>

                  <div className="relative z-10">
                    <motion.div
                      className="flex items-center justify-center mb-8"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                    >
                      <div className="bg-gradient-to-r from-pink-100/80 to-purple-100/80 backdrop-blur-sm p-4 rounded-2xl border border-pink-200">
                        <div className="flex items-center justify-center space-x-3">
                          <Heart className="w-8 h-8 text-pink-500" fill="currentColor" />
                          <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 font-comic m-0">
                            {textConfig.letter.recipient}
                          </h3>
                          <Heart className="w-8 h-8 text-purple-500" fill="currentColor" />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="bg-white/70 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-inner border border-pink-100 relative"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(254,240,245,0.85) 100%)",
                        backdropFilter: "blur(10px)"
                      }}
                    >
                      {/* Decorative lines */}
                      <div className="absolute left-8 top-0 bottom-0 w-px bg-pink-200/50" />
                      <div className="absolute left-12 top-0 bottom-0 w-px bg-pink-200/30" />

                      <div className="space-y-6 font-comic text-gray-700 leading-relaxed text-lg relative z-10">
                        {textConfig.letter.paragraphs.map((paragraph, index) => (
                          <motion.p
                            key={index}
                            className="relative"
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{
                              delay: 0.5 + index * 0.2,
                              duration: 0.8,
                              ease: "easeOut"
                            }}
                          >
                            {index === 0 && (
                              <span className="text-6xl font-bold text-pink-300/60 absolute -left-4 -top-2 leading-none select-none">
                                "
                              </span>
                            )}
                            <span className="relative z-10">{paragraph}</span>
                          </motion.p>
                        ))}

                        <motion.div
                          className="text-right mt-8 pt-6 border-t border-pink-200/50 border-dashed"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + textConfig.letter.paragraphs.length * 0.2, duration: 0.8 }}
                        >
                          <p className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-2">
                            With all my love,
                          </p>
                          <p className="text-xl text-pink-600 font-comic" style={{ whiteSpace: 'pre-line' }}>
                            {textConfig.letter.signature}
                          </p>

                          <motion.div
                            className="flex justify-end items-center mt-4 space-x-2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.7 + textConfig.letter.paragraphs.length * 0.2, duration: 0.5 }}
                          >
                            <Heart className="w-5 h-5 text-pink-400" fill="currentColor" />
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                            <Heart className="w-5 h-5 text-purple-400" fill="currentColor" />
                          </motion.div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Game Modal */}
          <AnimatePresence>
            {showGame && (
              <HeartCatcherGame
                onComplete={() => setGameCompleted(true)}
                onClose={() => setShowGame(false)}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;