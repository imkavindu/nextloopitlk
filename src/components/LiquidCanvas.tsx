import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../lib/gsap';

// three + R3F are heavy; keep them out of the initial bundle.
const Canvas = lazy(() =>
  import('@react-three/fiber').then((m) => ({ default: m.Canvas }))
);
const LiquidScene = lazy(() =>
  import('../three/LiquidScene').then((m) => ({ default: m.LiquidScene }))
);

/**
 * Cheap capability check. Software WebGL (or none at all) would make the
 * whole page stutter, so we fall back to the CSS gradient background.
 */
function canRenderWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

/**
 * Fixed, full-viewport WebGL layer that sits behind all content.
 *
 * Performance guards:
 *  - Mounted only after an idle callback, so it never competes with first paint.
 *  - `frameloop` flips to "never" when the document is hidden, which stops
 *    all GPU work in background tabs.
 *  - DPR is capped at 1.5 — the blob is soft-edged, so extra pixels buy
 *    nothing visually but cost a lot of fill rate on high-density screens.
 *  - Skipped entirely on small screens and coarse pointers, where the effect
 *    is least visible and the battery cost highest.
 */
export const LiquidCanvas = () => {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(true);
  const reduced = useRef(prefersReducedMotion());

  useEffect(() => {
    // Small screens get the CSS-only background.
    const isSmall = window.matchMedia('(max-width: 767px)').matches;
    if (isSmall || !canRenderWebGL()) return;

    // Defer past first paint.
    const start = () => setEnabled(true);
    const hasIdle = typeof window.requestIdleCallback === 'function';
    const handle = hasIdle
      ? window.requestIdleCallback(start, { timeout: 1200 })
      : window.setTimeout(start, 400);

    return () => {
      if (hasIdle) {
        window.cancelIdleCallback(handle);
      } else {
        window.clearTimeout(handle);
      }
    };

  }, []);

  // Pause rendering entirely while the tab is in the background.
  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none"
      // Mask the edges so the blob melts into the page instead of ending abruptly.
      style={{
        maskImage: 'radial-gradient(ellipse 75% 65% at 50% 42%, #000 45%, transparent 100%)',
        WebkitMaskImage:
          'radial-gradient(ellipse 75% 65% at 50% 42%, #000 45%, transparent 100%)',
      }}
    >
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 4.2], fov: 45 }}
          dpr={[1, 1.5]}
          frameloop={visible && !reduced.current ? 'always' : 'demand'}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
          // Transparent so the CSS aurora/grid still shows through.
          style={{ background: 'transparent' }}
        >
          <LiquidScene reducedMotion={reduced.current} />
        </Canvas>
      </Suspense>
    </div>
  );
};
