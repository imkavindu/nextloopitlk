/**
 * Full-screen film-grain overlay.
 *
 * The grain is an inline SVG feTurbulence rather than a PNG — it costs no
 * network request, scales to any DPI, and the browser rasterises it once.
 * Sits above content but ignores pointer events entirely.
 */
export const NoiseOverlay = () => (
  <div aria-hidden className="noise-overlay" />
);
