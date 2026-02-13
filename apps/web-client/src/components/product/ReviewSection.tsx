import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button, Alert } from '@repo/ui';
import { reviewService } from '@repo/services';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../hooks/queryKeys';
import type { Review } from '@repo/types';
import toast from 'react-hot-toast';
import { StarRating } from '../icons';

interface ReviewSectionProps {
  productId: string;
  reviews: Review[];
  avgRating: number;
  reviewCount: number;
  isAuthenticated: boolean;
}

export default function ReviewSection({
  productId,
  reviews,
  avgRating,
  reviewCount,
  isAuthenticated,
}: ReviewSectionProps) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }
    setSubmitting(true);
    try {
      await reviewService.createReview({ productId, rating, comment: comment.trim() });
      toast.success('Review submitted!');
      setComment('');
      setRating(5);
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.byProduct(productId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  /* Rating distribution */
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    return { star, count, pct: reviewCount > 0 ? (count / reviewCount) * 100 : 0 };
  });

  return (
    <div className="py-6">
      <div className="grid gap-8 md:grid-cols-[280px_1fr]">
        {/* Summary */}
        <div className="border-border rounded-xl border p-6 text-center">
          <p className="text-foreground text-5xl font-bold">
            {avgRating > 0 ? avgRating.toFixed(1) : '—'}
          </p>
          <div className="text-accent mt-1">
            <StarRating rating={avgRating} size={20} />
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            {reviewCount} review{reviewCount !== 1 ? 's' : ''}
          </p>
          <div className="mt-4 flex flex-col gap-1.5">
            {distribution.map((d) => (
              <div key={d.star} className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground flex w-6 items-center gap-0.5">
                  {d.star}
                  <Star size={10} className="fill-accent text-accent" />
                </span>
                <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                  <div
                    className="bg-accent h-full rounded-full transition-all"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
                <span className="text-muted-foreground w-6 text-right">{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews list + form */}
        <div>
          {/* Review form */}
          {isAuthenticated ? (
            <div className="border-border mb-8 rounded-xl border p-5">
              <h3 className="text-foreground mb-3 font-semibold">Write a Review</h3>
              {/* Star selector */}
              <div className="mb-3">
                <StarRating
                  rating={rating}
                  size={24}
                  interactive
                  onRate={setRating}
                  hoverRating={hoverRating}
                  onHover={setHoverRating}
                  onLeave={() => setHoverRating(0)}
                />
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this fish..."
                className="border-border bg-background text-foreground focus:border-primary mb-3 w-full rounded-lg border p-3 text-sm outline-none transition-colors"
                rows={3}
              />
              <Button size="sm" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Review'}
              </Button>
            </div>
          ) : (
            <Alert variant="info" className="mb-6">
              Please{' '}
              <a href="/login" className="text-primary font-semibold underline">
                sign in
              </a>{' '}
              to write a review.
            </Alert>
          )}

          {/* Review list */}
          {reviews.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">
              No reviews yet. Be the first to share your experience!
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {reviews.map((r) => (
                <div key={r.id} className="border-border border-b pb-4 last:border-0">
                  <div className="flex items-center gap-3">
                    {r.user?.avatar ? (
                      <img
                        src={r.user.avatar}
                        alt=""
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <span className="bg-primary flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white">
                        {r.user?.name?.charAt(0) ?? 'U'}
                      </span>
                    )}
                    <div>
                      <p className="text-foreground text-sm font-semibold">
                        {r.user?.name ?? 'Anonymous'}
                      </p>
                      <div className="flex items-center gap-2">
                        <StarRating rating={r.rating} size={12} />
                        <span className="text-muted-foreground text-xs">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {r.comment && (
                    <p className="text-foreground mt-2 text-sm leading-relaxed">{r.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
