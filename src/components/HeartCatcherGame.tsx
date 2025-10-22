import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Award, RotateCcw } from 'lucide-react';
import HelloKittyImg from '../images/hellokitty.gif';

interface HeartCatcherGameProps {
  onComplete: () => void;
  onClose: () => void;
}

interface HelloKitty {
  id: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  bounces: number;
}

const CatchTheKittyGame: React.FC<HeartCatcherGameProps> = ({ onComplete, onClose }) => {
  const [kitties, setKitties] = useState<HelloKitty[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [level, setLevel] = useState(1);
  const [catchedKitties, setCatchedKitties] = useState(0);
  const [gameAreaDimensions, setGameAreaDimensions] = useState({ width: 400, height: 300 });
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  
  const targetScore = 10;

  // Calculate responsive game area dimensions
  useEffect(() => {
    const updateDimensions = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Mobile responsive calculations
      let width, height;
      
      if (viewportWidth < 640) { // Mobile
        width = Math.min(viewportWidth - 48, 320); // 24px padding on each side
        height = Math.min(viewportHeight * 0.35, 240);
      } else if (viewportWidth < 768) { // Small tablet
        width = Math.min(viewportWidth - 64, 380);
        height = Math.min(viewportHeight * 0.4, 280);
      } else { // Desktop
        width = 400;
        height = 300;
      }
      
      setGameAreaDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Create a new Hello Kitty with responsive sizing
  const createKitty = (id: number): HelloKitty => {
    const baseSize = gameAreaDimensions.width < 350 ? 25 : 30; // Smaller kitties on mobile
    const size = Math.random() * baseSize + (gameAreaDimensions.width < 350 ? 30 : 40);
    return {
      id,
      x: Math.random() * (gameAreaDimensions.width - size),
      y: Math.random() * (gameAreaDimensions.height - size),
      speedX: (Math.random() - 0.5) * 2 + (level * 0.3), // Reduced from 4 to 2, and 0.5 to 0.3
      speedY: (Math.random() - 0.5) * 2 + (level * 0.3), // Reduced from 4 to 2, and 0.5 to 0.3
      size,
      bounces: 0
    };
  };

  // Initialize game
  const initializeGame = () => {
    const initialKitties: HelloKitty[] = [];
    const kittyCount = Math.min(2 + level, gameAreaDimensions.width < 350 ? 3 : 5); // Fewer kitties on mobile
    
    for (let i = 0; i < kittyCount; i++) {
      initialKitties.push(createKitty(i));
    }
    
    return initialKitties;
  };

  // Start game
  const startGame = () => {
    setGameStarted(true);
    setGameCompleted(false);
    setScore(0);
    setCatchedKitties(0);
    setTimeLeft(30);
    setLevel(1);
    setShowCelebration(false);
    setKitties(initializeGame());
  };

  // Move kitties animation with responsive boundaries
  const moveKitties = () => {
    setKitties(prevKitties => 
      prevKitties.map(kitty => {
        let newX = kitty.x + kitty.speedX;
        let newY = kitty.y + kitty.speedY;
        let newSpeedX = kitty.speedX;
        let newSpeedY = kitty.speedY;
        let newBounces = kitty.bounces;

        // Bounce off walls with current dimensions
        if (newX <= 0 || newX >= gameAreaDimensions.width - kitty.size) {
          newSpeedX = -newSpeedX;
          newX = Math.max(0, Math.min(gameAreaDimensions.width - kitty.size, newX));
          newBounces++;
        }
        if (newY <= 0 || newY >= gameAreaDimensions.height - kitty.size) {
          newSpeedY = -newSpeedY;
          newY = Math.max(0, Math.min(gameAreaDimensions.height - kitty.size, newY));
          newBounces++;
        }

        // Randomly change direction occasionally
        if (Math.random() < 0.005) {
          newSpeedX += (Math.random() - 0.5) * 2;
          newSpeedY += (Math.random() - 0.5) * 2;
          
          // Limit speed
          const maxSpeed = 2 + level * 0.3; // Reduced from 3 + level to 2 + level * 0.3
          newSpeedX = Math.max(-maxSpeed, Math.min(maxSpeed, newSpeedX));
          newSpeedY = Math.max(-maxSpeed, Math.min(maxSpeed, newSpeedY));
        }

        return {
          ...kitty,
          x: newX,
          y: newY,
          speedX: newSpeedX,
          speedY: newSpeedY,
          bounces: newBounces
        };
      })
    );
  };

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameCompleted) return;

    const gameLoop = () => {
      moveKitties();
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameStarted, gameCompleted, level, gameAreaDimensions]);

  // Handle game timer
  useEffect(() => {
    if (!gameStarted || gameCompleted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameStarted, gameCompleted]);

  // Check for win condition
  useEffect(() => {
    if (score >= targetScore && !gameCompleted) {
      setGameCompleted(true);
      setShowCelebration(true);
      onComplete();
    }
  }, [score, gameCompleted, onComplete]);

  // Level up
  useEffect(() => {
    if (catchedKitties > 0 && catchedKitties % 3 === 0 && catchedKitties <= 9) {
      setLevel(prev => prev + 1);
      // Add a new kitty when leveling up
      setKitties(prev => [...prev, createKitty(Date.now())]);
    }
  }, [catchedKitties]);

  // Handle kitty catch
  const catchKitty = (kittyId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const kitty = kitties.find(k => k.id === kittyId);
    if (!kitty) return;

    // Points based on kitty size (smaller = more points)
    const points = Math.round((100 - kitty.size) / 10);
    setScore(prev => prev + points);
    setCatchedKitties(prev => prev + 1);

    // Remove caught kitty temporarily, then respawn
    setKitties(prev => prev.filter(k => k.id !== kittyId));
    
    // Respawn after a short delay
    setTimeout(() => {
      setKitties(prev => [...prev, createKitty(Date.now())]);
    }, 1000 + Math.random() * 2000);
  };

  // Get performance message
  const getPerformanceMessage = () => {
    if (score >= targetScore) return "Amazing! You caught all the kitties! 🌟";
    if (score >= 8) return "So close! Almost got them all! 💖";
    if (score >= 5) return "Good job! You're getting better! 💕";
    return "Keep trying! Those kitties are tricky! 🌸";
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <motion.div 
        className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl shadow-2xl p-3 sm:p-6 w-full max-w-lg sm:max-w-2xl relative overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Celebration Hello Kitty */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              className="absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2 z-30"
              initial={{ y: -100, opacity: 0, rotate: -180 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.6 }}
            >
              <div className="w-16 h-16 sm:w-24 sm:h-24">
                <img src={HelloKittyImg} alt="Hello Kitty Celebration" className="w-full h-full object-contain" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white rounded-full p-1 sm:p-1 shadow-md hover:bg-gray-100 z-10"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-lg sm:text-2xl font-bold text-center text-pink-600 mb-2 sm:mb-3 font-comic mt-6 sm:mt-8">
          {gameCompleted ? "Game Complete! 🎉" : "Catch the Hello Kitty!"}
        </h2>
        
        {!gameStarted && !gameCompleted ? (
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16">
                <img src={HelloKittyImg} alt="Hello Kitty" className="w-full h-full object-contain" />
              </div>
            </div>
            <p className="text-gray-700 font-comic text-xs sm:text-sm px-2">
              Catch {targetScore} Hello Kitties in 30 seconds! Click on the moving kitties to catch them. 
              Smaller kitties give more points! The game gets harder as you progress! 💕
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-full font-comic shadow-md text-sm sm:text-base"
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
            >
              Start Catching!
            </motion.button>
          </div>
        ) : gameCompleted ? (
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-center">
                <Award className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500" />
              </div>
              <p className="text-base sm:text-lg font-comic text-pink-600 font-bold">
                {getPerformanceMessage()}
              </p>
              <div className="bg-white p-3 sm:p-4 rounded-lg border-2 border-dashed border-pink-300">
                <p className="font-comic text-gray-700 text-xs sm:text-sm">
                  {score >= targetScore ? 
                    `"You caught ${catchedKitties} kitties with ${score} points! Just like how you capture my heart every day! 💕"` :
                    `"You got ${score} points in time! Every attempt brings us closer together, just like every day with you! 💕"`
                  }
                </p>
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-comic grid grid-cols-2 gap-2">
                <p>⏱️ Time left: {timeLeft}s</p>
                <p>🎯 Score: {score}/{targetScore}</p>
                <p>🐱 Kitties: {catchedKitties}</p>
                <p>📈 Level: {level}</p>
              </div>
              {score < targetScore && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 sm:px-5 rounded-full font-comic shadow-md text-sm sm:text-base"
                  onClick={(e) => {
                    e.stopPropagation();
                    startGame();
                  }}
                >
                  <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                  Try Again
                </motion.button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {/* Game Stats - Mobile responsive grid */}
            <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-3 sm:mb-4">
              <div className="bg-white px-2 py-1 sm:px-3 sm:py-2 rounded-full shadow text-xs sm:text-sm text-center">
                <span className="font-comic font-bold text-pink-600">{score}/{targetScore}</span>
              </div>
              <div className="bg-white px-2 py-1 sm:px-3 sm:py-2 rounded-full shadow text-xs sm:text-sm text-center">
                <span className="font-comic font-bold text-blue-600">{timeLeft}s</span>
              </div>
              <div className="bg-white px-2 py-1 sm:px-3 sm:py-2 rounded-full shadow text-xs sm:text-sm text-center">
                <span className="font-comic font-bold text-purple-600">L{level}</span>
              </div>
            </div>
            
            {/* Game Area - Responsive container */}
            <div className="flex justify-center">
              <div 
                ref={gameAreaRef}
                className="bg-gradient-to-br from-sky-100 via-pink-50 to-purple-100 rounded-lg border-2 sm:border-4 border-white shadow-inner relative overflow-hidden"
                style={{ width: gameAreaDimensions.width, height: gameAreaDimensions.height }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Floating hearts background - responsive count */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(gameAreaDimensions.width < 350 ? 3 : 5)].map((_, i) => (
                    <Heart 
                      key={i}
                      className="absolute text-pink-200 animate-pulse"
                      style={{
                        left: `${20 + i * (gameAreaDimensions.width < 350 ? 25 : 20)}%`,
                        top: `${10 + (i % 3) * 30}%`,
                        animationDelay: `${i * 0.5}s`
                      }}
                      size={gameAreaDimensions.width < 350 ? 12 : 16}
                    />
                  ))}
                </div>

                {/* Moving Hello Kitties */}
                <AnimatePresence>
                  {kitties.map((kitty) => (
                    <motion.div
                      key={kitty.id}
                      className="absolute cursor-pointer hover:scale-110 transition-transform touch-manipulation"
                      style={{
                        left: kitty.x,
                        top: kitty.y,
                        width: kitty.size,
                        height: kitty.size
                      }}
                      onClick={(e) => catchKitty(kitty.id, e)}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        catchKitty(kitty.id, e as any);
                      }}
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      whileTap={{ scale: 0.8 }}
                      initial={{ scale: 0, rotate: 180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img 
                        src={HelloKittyImg} 
                        alt="Hello Kitty" 
                        className="w-full h-full object-contain pointer-events-none"
                        draggable={false}
                      />
                      
                      {/* Sparkle effect around kitty - smaller on mobile */}
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        {[...Array(gameAreaDimensions.width < 350 ? 2 : 4)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                            style={{
                              left: `${50 + 40 * Math.cos(i * Math.PI / (gameAreaDimensions.width < 350 ? 1 : 2))}%`,
                              top: `${50 + 40 * Math.sin(i * Math.PI / (gameAreaDimensions.width < 350 ? 1 : 2))}%`,
                            }}
                          />
                        ))}
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Game instructions overlay for first few seconds */}
                {gameStarted && timeLeft > 27 && (
                  <motion.div
                    className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 1, delay: 2 }}
                  >
                    <p className="text-white font-comic text-sm sm:text-lg font-bold text-center px-2">
                      {gameAreaDimensions.width < 350 ? "Tap the kitties! 🐱" : "Click the kitties! 🐱"}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white rounded-full h-2 sm:h-3 overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-400 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${(score / targetScore) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CatchTheKittyGame;