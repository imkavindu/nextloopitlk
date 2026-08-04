import { CheckCircle2 } from 'lucide-react';
import { useGsapContext } from '../hooks/useGsap';
import { useCountUp, useMagnetic } from '../hooks/useInteractions';
import { gsap, EASE, prefersReducedMotion } from '../lib/gsap';

const bullets = [
  'Stop bleeding leads to inferior, but faster competitors',
  'Weaponize conversion psychology to force visitors to buy',
  'Crush search results until you are the only choice',
  'Automate the chaos and focus 100% on massive profit',
];

export const About = () => {
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.2);
  const counterRef = useCountUp<HTMLSpanElement>(100, '%');

  const scope = useGsapContext<HTMLElement>((_ctx, el) => {
    if (prefersReducedMotion()) return;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top 72%', once: true },
    });

    tl.from('[data-about-title]', { opacity: 0, x: -40, duration: 0.9, ease: EASE.expo })
      .from('[data-about-quote]', { opacity: 0, x: -30, duration: 0.8, ease: EASE.out }, '-=0.55')
      .from(
        '[data-about-bullet]',
        { opacity: 0, x: -26, duration: 0.6, stagger: 0.1, ease: EASE.out },
        '-=0.45'
      )
      .from('[data-about-cta]', { opacity: 0, y: 22, duration: 0.6, ease: 'back.out(1.6)' }, '-=0.25')
      .from(
        '[data-about-visual]',
        { opacity: 0, scale: 0.88, rotate: -3, duration: 1.1, ease: EASE.expo },
        '-=1.1'
      )
      .from('[data-about-badge]', { opacity: 0, scale: 0.6, duration: 0.7, ease: 'back.out(2)' }, '-=0.4');

    // Image drifts against the scroll for depth.
    gsap.to('[data-about-visual]', {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
    });
  });

  return (
    <section ref={scope} id="about" className="relative py-20 sm:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 w-full">
            <h2
              data-about-title
              className="text-2xl sm:text-3xl lg:text-5xl font-display font-extrabold mb-6 leading-tight text-white"
            >
              Your Competitors Are Already{' '}
              <span className="text-gradient">Hunting Your Customers.</span>
            </h2>

            <p
              data-about-quote
              className="text-slate-400 text-base sm:text-lg mb-8 leading-relaxed italic border-l-2 border-cyan-400/50 pl-5"
            >
              &ldquo;While you hesitate, your competition is leveraging aggressive digital strategies
              to dominate the market. Every day you wait is a day they get stronger and you lose
              market share.&rdquo;
            </p>

            <div className="space-y-4 mb-9">
              {bullets.map((item) => (
                <div key={item} data-about-bullet className="flex items-start gap-3 group">
                  <CheckCircle2 className="text-cyan-400 w-5 h-5 flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-slate-200 text-sm sm:text-base font-semibold tracking-tight">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <a
              ref={ctaRef}
              data-about-cta
              href="#contact"
              className="btn-primary w-full sm:w-auto text-center px-10 py-4 rounded-full font-bold inline-flex items-center justify-center"
            >
              Unleash My Growth Now
            </a>
          </div>

          <div className="lg:flex-1 relative w-full max-w-lg lg:max-w-none mx-auto lg:mx-0">
            <div data-about-visual className="relative z-10">
              <div className="aspect-square rounded-[32px] glass p-3 sm:p-4 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
                  alt="Engineers building software"
                  loading="lazy"
                  className="w-full h-full object-cover rounded-3xl opacity-85"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div
                data-about-badge
                className="absolute bottom-4 right-4 sm:-bottom-6 sm:-right-6 glass p-5 sm:p-6 rounded-3xl z-20 animate-bounce-slow border border-cyan-400/20"
              >
                <div className="text-2xl sm:text-3xl font-display font-extrabold text-gradient">
                  <span ref={counterRef}>0%</span>
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400 uppercase font-bold tracking-[0.2em] mt-1">
                  Commitment
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/10 blur-[110px] -z-10 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};
