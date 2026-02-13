import { Star } from 'lucide-react';

interface StarRatingProps {
  /** Current rating value (0–max) */
  rating: number;
  /** Maximum stars (default 5) */
  max?: number;
  /** Star icon size in px */
  size?: number;
  /** Additional className on the wrapper */
  className?: string;
  /** Interactive mode — enables click & hover */
  interactive?: boolean;
  /** Called when the user clicks a star (interactive mode) */
  onRate?: (rating: number) => void;
  /** Hover-preview rating (managed by parent) */
  hoverRating?: number;
  /** Called on mouse-enter over a star */
  onHover?: (rating: number) => void;
  /** Called on mouse-leave */
  onLeave?: () => void;
}

/**
 * Renders a row of star icons.
 *
 * - **Display mode** (default): shows filled / empty stars for the given `rating`.
 * - **Interactive mode**: enables hover preview + click to rate.
 *
 * ```tsx
 * <StarRating rating={4.3} />
 * <StarRating rating={rating} interactive onRate={setRating} hoverRating={hover} onHover={setHover} onLeave={() => setHover(0)} />
 * ```
 */
export default function StarRating({
  rating,
  max = 5,
  size = 16,
  className = '',
  interactive = false,
  onRate,
  hoverRating = 0,
  onHover,
  onLeave,
}: StarRatingProps) {
  const displayRating = hoverRating || rating;

  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className}`}
      role="img"
      aria-label={`${rating} out of ${max} stars`}
    >
      {Array.from({ length: max }, (_, i) => {
        const starIndex = i + 1;
        const isFilled = starIndex <= Math.round(displayRating);

        const star = (
          <Star
            key={i}
            size={size}
            className={`transition-colors ${
              isFilled ? 'fill-accent text-accent' : 'text-muted-foreground/30 fill-none'
            }`}
          />
        );

        if (!interactive) return star;

        return (
          <button
            key={i}
            type="button"
            onClick={() => onRate?.(starIndex)}
            onMouseEnter={() => onHover?.(starIndex)}
            onMouseLeave={onLeave}
            className="cursor-pointer transition-transform hover:scale-110"
          >
            {star}
          </button>
        );
      })}
    </span>
  );
}
