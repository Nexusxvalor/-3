import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from 'framer-motion';

const SplashBackground: React.FC = () => {
  const motionRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const animationsRef = useRef<gsap.core.Timeline[]>([]);

  useEffect(() => {
    if (shouldReduceMotion || !motionRef.current) return;

    const createSplashCircles = () => {
      if (!motionRef.current) return;

      // Clean up existing animations
      animationsRef.current.forEach(tl => tl.kill());
      animationsRef.current = [];
      motionRef.current.innerHTML = '';

      const screenDiagonal = Math.min(window.innerWidth, window.innerHeight) * 1.5;
      
      const splashConfig = [
        { 
          x: window.innerWidth * 0.25, 
          y: window.innerHeight * 0.3, 
          color: 'rgba(251, 113, 133, 0.08)', // Reduced opacity
          maxSize: screenDiagonal * 0.8 // Reduced size
        },
        { 
          x: window.innerWidth * 0.75, 
          y: window.innerHeight * 0.7, 
          color: 'rgba(236, 72, 153, 0.08)',
          maxSize: screenDiagonal * 0.9
        }
      ]; // Reduced from 3 to 2 circles

      splashConfig.forEach((config, index) => {
        const circle = document.createElement('div');
        circle.className = 'absolute pointer-events-none';
        
        Object.assign(circle.style, {
          width: '30px', // Reduced from 50px
          height: '30px',
          backgroundColor: config.color,
          borderRadius: '50%',
          left: `${config.x - 15}px`,
          top: `${config.y - 15}px`,
          filter: 'blur(1px)', // Reduced blur
          willChange: 'transform, opacity' // Add will-change for GPU acceleration
        });
        
        motionRef.current?.appendChild(circle);
        
        const splashTl = gsap.timeline({ 
          repeat: -1, 
          delay: index * 2, // Increased delay
          paused: false
        });
        
        splashTl
          .set(circle, { opacity: 0, scale: 0 })
          .to(circle, { 
            opacity: 1, 
            scale: 1, 
            duration: 0.5, 
            ease: "power2.out" 
          })
          .to(circle, { 
            scale: config.maxSize / 30, 
            opacity: 0, 
            duration: 4, // Slower animation
            ease: "power1.out" 
          })
          .to(circle, { scale: 0, duration: 0.1 });

        animationsRef.current.push(splashTl);
      });
    };

    createSplashCircles();
    
    // Debounce resize handler
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(createSplashCircles, 300);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      animationsRef.current.forEach(tl => tl.kill());
      if (motionRef.current) {
        motionRef.current.innerHTML = '';
      }
    };
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return <div ref={motionRef} className="fixed inset-0 pointer-events-none z-0"></div>;
};

export default SplashBackground;