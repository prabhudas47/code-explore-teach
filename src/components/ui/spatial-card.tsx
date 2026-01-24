import { useRef, ReactNode, MouseEvent } from 'react';
import { cn } from '@/lib/utils';

interface SpatialCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'primary' | 'accent';
  depth?: 'shallow' | 'medium' | 'deep';
  tilt?: boolean;
}

export const SpatialCard = ({
  children,
  className,
  glowColor = 'primary',
  depth = 'medium',
  tilt = true,
}: SpatialCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !tilt) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    cardRef.current.style.transform = `
      perspective(1000px)
      translateY(-8px)
      translateZ(20px)
      rotateX(${y * -3}deg)
      rotateY(${x * 3}deg)
    `;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = '';
  };

  const depthShadows = {
    shallow: 'shadow-soft',
    medium: 'shadow-medium',
    deep: 'shadow-hard',
  };

  const glowClasses = {
    primary: 'hover:border-primary/40 hover:shadow-[0_0_40px_hsl(var(--primary)/0.12)]',
    accent: 'hover:border-accent/40 hover:shadow-[0_0_40px_hsl(var(--accent)/0.12)]',
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative bg-card border border-border/50 rounded-2xl',
        'transition-all duration-500 ease-out',
        'transform-gpu will-change-transform',
        depthShadows[depth],
        glowClasses[glowColor],
        className
      )}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
};

interface FloatingPanelProps {
  children: ReactNode;
  className?: string;
}

export const FloatingPanel = ({ children, className }: FloatingPanelProps) => {
  return (
    <div
      className={cn(
        'relative',
        'bg-gradient-to-br from-card via-surface-elevated to-secondary/50',
        'border border-border/40',
        'rounded-3xl',
        'shadow-deep',
        'backdrop-blur-sm',
        className
      )}
    >
      {/* Subtle inner glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export const GlassCard = ({ children, className }: GlassCardProps) => {
  return (
    <div
      className={cn(
        'relative',
        'bg-card/60',
        'backdrop-blur-xl backdrop-saturate-150',
        'border border-border/30',
        'rounded-2xl',
        'shadow-medium',
        className
      )}
    >
      {children}
    </div>
  );
};
