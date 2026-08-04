import { useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSound } from '../hooks/useSound';
import { gsap, prefersReducedMotion } from '../lib/gsap';

/**
 * Header control for UI sound. Renders an animated 4-bar equalizer that
 * plays while sound is on and flatlines when muted, so the state is legible
 * at a glance without reading the icon.
 */
export const SoundToggle = ({ className = '' }: { className?: string }) => {
  const { enabled, toggle } = useSound();
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = barsRef.current;
    if (!el || prefersReducedMotion()) return;

    const bars = Array.from(el.children) as HTMLElement[];

    const ctx = gsap.context(() => {
      if (enabled) {
        // Each bar bounces on its own loop for an organic, non-synced feel.
        bars.forEach((bar, i) => {
          gsap.to(bar, {
            scaleY: gsap.utils.random(0.35, 1),
            duration: gsap.utils.random(0.32, 0.6),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.08,
            transformOrigin: 'center',
          });
        });
      } else {
        gsap.to(bars, {
          scaleY: 0.18,
          duration: 0.3,
          ease: 'power2.out',
          transformOrigin: 'center',
        });
      }
    }, el);

    return () => ctx.revert();
  }, [enabled]);

  return (
    <button
      type="button"
      onClick={toggle}
      // The toggle plays its own confirmation blip; skip the generic click sound.
      data-no-sound
      data-cursor={enabled ? 'Mute' : 'Unmute'}
      aria-label={enabled ? 'Mute interface sounds' : 'Unmute interface sounds'}
      aria-pressed={enabled}
      title={enabled ? 'Sound on' : 'Sound off'}
      className={`group relative w-10 h-10 rounded-xl glass flex items-center justify-center text-slate-300 hover:text-white hover:border-cyan-400/40 transition-colors ${className}`}
    >
      {/* Equalizer bars — the primary visual state. */}
      <div ref={barsRef} className="flex items-end gap-[3px] h-4" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`w-[2.5px] h-full rounded-full transition-colors duration-300 ${
              enabled
                ? 'bg-gradient-to-t from-blue-400 to-cyan-300'
                : 'bg-slate-600 group-hover:bg-slate-500'
            }`}
          />
        ))}
      </div>

      {/* Icon confirms meaning for anyone unsure about the bars. */}
      <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#0a0f1c] border border-white/10 flex items-center justify-center">
        {enabled ? (
          <Volume2 className="w-2.5 h-2.5 text-cyan-300" />
        ) : (
          <VolumeX className="w-2.5 h-2.5 text-slate-500" />
        )}
      </span>
    </button>
  );
};
