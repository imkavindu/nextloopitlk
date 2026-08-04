import { CheckCircle2, Megaphone, MessageSquare } from 'lucide-react';
import { useGsapContext } from '../hooks/useGsap';
import { gsap, EASE, prefersReducedMotion } from '../lib/gsap';

const pillars = [
  {
    icon: CheckCircle2,
    title: '100% Satisfaction',
    body: 'We don\u2019t ship "okay." We ship results. We work until your vision is real and profitable.',
    accent: 'text-blue-400',
    ring: 'bg-blue-500/15 border-blue-400/25',
  },
  {
    icon: MessageSquare,
    title: 'Zero Tech Jargon',
    body: 'Transparent communication. You\u2019ll always know exactly what we are building and why it matters.',
    accent: 'text-emerald-400',
    ring: 'bg-emerald-500/15 border-emerald-400/25',
  },
  {
    icon: Megaphone,
    title: 'Performance First',
    body: 'Our systems are built for speed and ROI. If it doesn\u2019t move the needle, we don\u2019t build it.',
    accent: 'text-purple-400',
    ring: 'bg-purple-500/15 border-purple-400/25',
  },
];

export const RiskReversal = () => {
  const scope = useGsapContext<HTMLElement>((_ctx, el) => {
    if (prefersReducedMotion()) return;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top 78%', once: true },
    });

    tl.from('[data-risk-panel]', {
      opacity: 0,
      y: 60,
      scale: 0.97,
      duration: 1,
      ease: EASE.expo,
    })
      .from(
        '[data-risk-title]',
        { opacity: 0, y: 26, duration: 0.7, ease: EASE.out },
        '-=0.6'
      )
      .from(
        '[data-risk-item]',
        { opacity: 0, y: 34, duration: 0.7, stagger: 0.13, ease: EASE.out },
        '-=0.4'
      )
      .from(
        '[data-risk-icon]',
        {
          scale: 0.4,
          rotate: -25,
          duration: 0.6,
          stagger: 0.13,
          ease: 'back.out(2)',
          // Drop the inline transform so the CSS hover scale can take over.
          clearProps: 'transform',
        },

        '-=0.7'
      );
  });

  return (
    <section ref={scope} className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-blue-600/10 -z-10 blur-[140px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          data-risk-panel
          className="glass p-8 sm:p-12 lg:p-20 rounded-[32px] sm:rounded-[48px] text-center border border-blue-400/15"
        >
          <h2
            data-risk-title
            className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold mb-12 text-white"
          >
            Engineering <span className="text-gradient">Trust</span> into Every Partnership
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {pillars.map((p) => (
              <div key={p.title} data-risk-item className="group">
                <div
                  data-risk-icon
                  className={`w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto mb-6 ${p.ring} transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1`}
                >
                  <p.icon className={`${p.accent} w-6 h-6`} />
                </div>

                <h4 className="font-display font-bold text-lg sm:text-xl text-white mb-3">
                  {p.title}
                </h4>

                <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
