import { useEffect } from 'react';
import { initSmoothScroll } from '../lib/lenis';
import { ScrollTrigger } from '../lib/gsap';

/**
 * Mounts Lenis once for the whole app and tears it down (ticker callback,
 * event listeners and instance) when the tree unmounts.
 *
 * Also refreshes ScrollTrigger after fonts/images settle, since late layout
 * shifts would otherwise leave every trigger measuring stale positions.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const destroy = initSmoothScroll();

    const refresh = () => ScrollTrigger.refresh();

    window.addEventListener('load', refresh);
    void document.fonts?.ready.then(refresh);

    // Debounced refresh on resize — ScrollTrigger handles this itself, but
    // orientation changes on mobile need the extra nudge.
    let resizeTimer: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(refresh, 200);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('load', refresh);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
      destroy();
    };
  }, []);
}
