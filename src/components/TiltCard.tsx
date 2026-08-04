import { useTilt } from '../hooks/useInteractions';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Max tilt in degrees. Lower for large cards. */
  max?: number;
  scale?: number;
}

/**
 * Wrapper that gives any card a smooth pointer-following 3D tilt plus the
 * `.card-glow` gradient border / sheen treatment. Tilt is automatically
 * disabled on touch devices and for `prefers-reduced-motion` users.
 */
export const TiltCard = ({ children, className = '', max = 8, scale = 1.02 }: TiltCardProps) => {
  const ref = useTilt<HTMLDivElement>({ max, scale });

  return (
    <div ref={ref} className={`glass card-glow ${className}`}>
      {children}
    </div>
  );
};
