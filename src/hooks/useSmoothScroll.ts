import { useEffect } from 'react';
import { initSmoothScroll, getLenis } from '../lib/lenis';
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

    const refresh = () => {
      getLenis()?.resize();
      ScrollTrigger.refresh();
    };

    // Delayed refreshes after initial paint/font loading so large desktop layouts settle
    const t1 = window.setTimeout(refresh, 300);
    const t2 = window.setTimeout(refresh, 1000);

    window.addEventListener('load', refresh);
    void document.fonts?.ready.then(refresh);

    // ResizeObserver monitors layout height shifts on document.body
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        refresh();
      });
      resizeObserver.observe(document.body);
    }

    // Debounced refresh on window resize
    let resizeTimer: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(refresh, 150);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener('load', refresh);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
      resizeObserver?.disconnect();
      destroy();
    };
  }, []);
}
