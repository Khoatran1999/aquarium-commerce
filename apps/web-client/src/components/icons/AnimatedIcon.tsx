import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import type { LucideIcon, LucideProps } from 'lucide-react';

type MotionDivProps = HTMLMotionProps<'div'>;

interface AnimatedIconProps extends Omit<MotionDivProps, 'children'> {
  /** A lucide-react icon component */
  icon: LucideIcon;
  /** Icon pixel size (lucide `size` prop) */
  size?: number;
  /** Extra classes on the <svg> itself */
  iconClassName?: string;
  /** Extra lucide props forwarded to the icon */
  iconProps?: Omit<LucideProps, 'size' | 'className'>;
  /** Scale on hover (set 1 to disable) */
  hoverScale?: number;
  /** Scale on tap / click (set 1 to disable) */
  tapScale?: number;
}

/**
 * Wraps any lucide-react icon with Framer Motion hover + tap micro-interactions.
 *
 * ```tsx
 * <AnimatedIcon icon={Fish} size={24} className="text-primary" />
 * ```
 */
const AnimatedIcon = forwardRef<HTMLDivElement, AnimatedIconProps>(function AnimatedIcon(
  {
    icon: Icon,
    size = 24,
    iconClassName,
    iconProps,
    hoverScale = 1.15,
    tapScale = 0.9,
    className,
    ...motionProps
  },
  ref,
) {
  return (
    <motion.div
      ref={ref}
      className={className}
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: tapScale }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...motionProps}
    >
      <Icon size={size} className={iconClassName} {...iconProps} />
    </motion.div>
  );
});

export default AnimatedIcon;
