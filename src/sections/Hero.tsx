import { ArrowRight, MessageSquare } from 'lucide-react';

import { useGsapContext } from '../hooks/useGsap';
import { useMagnetic } from '../hooks/useInteractions';
import { gsap, EASE, prefersReducedMotion } from '../lib/gsap';
import { AuroraBackground } from '../components/AuroraBackground';
import { verticals } from '../data/content';

/** Splits a string into per-word spans so GSAP can stagger the reveal. */
const SplitWords = ({ text, className = '' }: { text: string; className?: string }) => (
  <>
    {text.split(' ').map((word, i) => (
      <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
        <span data-word className={`inline-block ${className}`}>
          {word}
          {'\u00A0'}
        </span>
      </span>
    ))}
  </>
);

export const Hero = () => {
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.22);

  const scope = useGsapContext<HTMLElement>((_ctx, el) => {
    if (prefersReducedMotion()) {
      gsap.set(el.querySelectorAll('[data-word], [data-hero]'), { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: EASE.expo } });

    // Headline words rise out of their masks — now the first beat of the
    // timeline, so no negative offset here.
    tl.from('[data-word]', { yPercent: 115, opacity: 0, duration: 1, stagger: 0.035 })
      .from('[data-hero-kicker]', { opacity: 0, y: 20, duration: 0.7, ease: EASE.out }, '-=0.6')

      .from('[data-hero-sub]', { opacity: 0, y: 24, duration: 0.8, ease: EASE.out }, '-=0.5')
      .from(
        '[data-hero-cta]',
        { opacity: 0, y: 26, scale: 0.96, duration: 0.7, stagger: 0.12, ease: 'back.out(1.5)' },
        '-=0.45'
      )
      .from('[data-hero-trust]', { opacity: 0, y: 24, duration: 0.8, ease: EASE.out }, '-=0.35')
      .from('[data-hero-scroll]', { opacity: 0, duration: 0.6 }, '-=0.3');

    // Headline content drifts slightly as you scroll away (parallax + fade)
    gsap.to('[data-hero-content]', {
      yPercent: 14,
      opacity: 0.25,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'bottom 90%',
        end: 'bottom top',
        scrub: 0.8,
      },
    });

    // Looping cue on the scroll indicator
    gsap.to('[data-hero-scroll] span', {
      y: 14,
      opacity: 0,
      duration: 1.4,
      repeat: -1,
      ease: 'power1.inOut',
    });
  });

  return (
    <section
      ref={scope}
      className="relative min-h-[92vh] flex items-center pt-28 pb-20 sm:pt-32 lg:pt-40 lg:pb-28 overflow-hidden"
    >
      <AuroraBackground variant="hero" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center w-full">
        <div data-hero-content>
          <h1 className="text-[2rem] leading-[1.12] sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight mb-6 text-white max-w-5xl mx-auto">

            <SplitWords text="Your Website Is Either A" />
            <br className="hidden sm:inline" />
            <SplitWords text="Profit Center Or A Cost Center." className="text-gradient text-glow" />
          </h1>

          <p
            data-hero-kicker
            className="text-[10px] sm:text-xs text-cyan-300/90 font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-6 sm:mb-8"
          >
            Trusted by founders and established businesses for high-stakes growth
          </p>

          <p
            data-hero-sub
            className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto mb-9 sm:mb-11 leading-relaxed px-2 sm:px-0"
          >
            Stop yielding market share to faster competitors. We build high-velocity sales systems
            that turn visitors into loyal, paying customers with engineering precision.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-2 sm:px-0">
            <a
              ref={ctaRef}
              data-hero-cta
              data-cursor="Free strategy"
              href="#contact"
              className="btn-primary w-full sm:w-auto px-8 py-4 rounded-full font-bold text-base sm:text-lg flex items-center justify-center gap-2 group"
            >
              Claim My Free Growth Strategy
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>

            <a
              data-hero-cta
              data-cursor="Chat now"
              href="https://wa.me/94788920777"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost w-full sm:w-auto text-white px-8 py-4 rounded-full font-bold text-base sm:text-lg flex items-center justify-center gap-2"
            >

              <MessageSquare className="w-5 h-5 text-emerald-400" />
              WhatsApp An Expert
            </a>
          </div>

          <p className="mt-5 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
            100% Free • Secure &amp; Private • No Obligation
          </p>

          <div data-hero-trust className="mt-14 flex flex-col items-center">
            <p className="text-xs sm:text-sm text-slate-400 font-medium mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/60" />
              Specialized engineering for high-growth verticals
            </p>

            {/* Infinite marquee — duplicated track for a seamless loop */}
            <div className="marquee-mask w-full max-w-4xl overflow-hidden">
              <div className="marquee-track gap-10 sm:gap-16">
                {[...verticals, ...verticals].map((v, i) => (
                  <span
                    key={`${v}-${i}`}
                    className="whitespace-nowrap font-bold text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-500 hover:text-cyan-300 transition-colors cursor-default"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          data-hero-scroll
          aria-hidden
          className="hidden lg:flex justify-center mt-16"
        >
          <div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-1.5">
            <span className="w-1 h-2 rounded-full bg-cyan-400" />
          </div>
        </div>
      </div>
    </section>
  );
};
