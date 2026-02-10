import { useState } from 'react';
import { cn } from '../utils/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface ImageGalleryProps {
  images: { url: string; alt?: string | null }[];
  className?: string;
}

export function ImageGallery({ images, className }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div
        className={cn(
          'bg-muted flex aspect-square items-center justify-center rounded-xl',
          className,
        )}
      >
        <span className="text-muted-foreground text-sm">No images</span>
      </div>
    );
  }

  const active = images[activeIndex];
  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < images.length - 1;

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Main image */}
      <div className="bg-muted relative aspect-square overflow-hidden rounded-xl">
        <img
          src={active.url}
          alt={active.alt ?? ''}
          className="h-full w-full object-cover transition-opacity duration-300"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => hasPrev && setActiveIndex(activeIndex - 1)}
              disabled={!hasPrev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow transition-colors hover:bg-white disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => hasNext && setActiveIndex(activeIndex + 1)}
              disabled={!hasNext}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow transition-colors hover:bg-white disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                'h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors',
                i === activeIndex
                  ? 'border-primary'
                  : 'border-transparent opacity-60 hover:opacity-100',
              )}
            >
              <img src={img.url} alt={img.alt ?? ''} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
