import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { gsap } from '../lib/gsap';
import { scrollTo } from '../lib/lenis';


export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 300);
    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Progress ring driven by ScrollTrigger, inside a disposable context.
  useEffect(() => {
    if (!isVisible || !ringRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(ringRef.current, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        },
      });
    });

    return () => ctx.revert();
  }, [isVisible]);

  // Lenis handles the easing (and respects reduced motion internally).
  const scrollToTop = () => scrollTo(0);


  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="fixed bottom-22 sm:bottom-24 right-4 sm:right-6 z-[60] w-12 h-12 glass rounded-full flex items-center justify-center text-white group hover:border-cyan-400/50 transition-colors"
          style={{ bottom: '5.5rem' }}
        >
          {/* Circular scroll progress */}
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48" aria-hidden>
            <circle
              ref={ringRef}
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="url(#stg)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="138.2"
              strokeDashoffset="138.2"
            />
            <defs>
              <linearGradient id="stg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>
          </svg>

          <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
