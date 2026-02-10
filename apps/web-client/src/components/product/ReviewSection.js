import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button, Alert } from '@repo/ui';
import { reviewService } from '@repo/services';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../hooks/queryKeys';
import toast from 'react-hot-toast';
export default function ReviewSection({ productId, reviews, avgRating, reviewCount, isAuthenticated, }) {
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
        }
        catch {
            toast.error('Failed to submit review');
        }
        finally {
            setSubmitting(false);
        }
    };
    /* Rating distribution */
    const distribution = [5, 4, 3, 2, 1].map((star) => {
        const count = reviews.filter((r) => Math.round(r.rating) === star).length;
        return { star, count, pct: reviewCount > 0 ? (count / reviewCount) * 100 : 0 };
    });
    return (_jsx("div", { className: "py-6", children: _jsxs("div", { className: "grid gap-8 md:grid-cols-[280px_1fr]", children: [_jsxs("div", { className: "border-border rounded-xl border p-6 text-center", children: [_jsx("p", { className: "text-foreground text-5xl font-bold", children: avgRating > 0 ? avgRating.toFixed(1) : '—' }), _jsxs("div", { className: "text-accent mt-1 text-lg", children: ['★'.repeat(Math.round(avgRating)), '☆'.repeat(5 - Math.round(avgRating))] }), _jsxs("p", { className: "text-muted-foreground mt-1 text-sm", children: [reviewCount, " review", reviewCount !== 1 ? 's' : ''] }), _jsx("div", { className: "mt-4 flex flex-col gap-1.5", children: distribution.map((d) => (_jsxs("div", { className: "flex items-center gap-2 text-xs", children: [_jsxs("span", { className: "text-muted-foreground w-6", children: [d.star, "\u2605"] }), _jsx("div", { className: "bg-muted h-2 flex-1 overflow-hidden rounded-full", children: _jsx("div", { className: "bg-accent h-full rounded-full transition-all", style: { width: `${d.pct}%` } }) }), _jsx("span", { className: "text-muted-foreground w-6 text-right", children: d.count })] }, d.star))) })] }), _jsxs("div", { children: [isAuthenticated ? (_jsxs("div", { className: "border-border mb-8 rounded-xl border p-5", children: [_jsx("h3", { className: "text-foreground mb-3 font-semibold", children: "Write a Review" }), _jsx("div", { className: "mb-3 flex gap-1", children: [1, 2, 3, 4, 5].map((star) => (_jsx("button", { type: "button", onClick: () => setRating(star), onMouseEnter: () => setHoverRating(star), onMouseLeave: () => setHoverRating(0), className: "text-2xl transition-colors", children: _jsx("span", { className: star <= (hoverRating || rating) ? 'text-accent' : 'text-muted-foreground/30', children: "\u2605" }) }, star))) }), _jsx("textarea", { value: comment, onChange: (e) => setComment(e.target.value), placeholder: "Share your experience with this fish...", className: "border-border bg-background text-foreground focus:border-primary mb-3 w-full rounded-lg border p-3 text-sm outline-none transition-colors", rows: 3 }), _jsx(Button, { size: "sm", onClick: handleSubmit, disabled: submitting, children: submitting ? 'Submitting…' : 'Submit Review' })] })) : (_jsxs(Alert, { variant: "info", className: "mb-6", children: ["Please", ' ', _jsx("a", { href: "/login", className: "text-primary font-semibold underline", children: "sign in" }), ' ', "to write a review."] })), reviews.length === 0 ? (_jsx("p", { className: "text-muted-foreground py-8 text-center text-sm", children: "No reviews yet. Be the first to share your experience!" })) : (_jsx("div", { className: "flex flex-col gap-4", children: reviews.map((r) => (_jsxs("div", { className: "border-border border-b pb-4 last:border-0", children: [_jsxs("div", { className: "flex items-center gap-3", children: [r.user?.avatar ? (_jsx("img", { src: r.user.avatar, alt: "", className: "h-9 w-9 rounded-full object-cover" })) : (_jsx("span", { className: "bg-primary flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white", children: r.user?.name?.charAt(0) ?? 'U' })), _jsxs("div", { children: [_jsx("p", { className: "text-foreground text-sm font-semibold", children: r.user?.name ?? 'Anonymous' }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-accent text-xs", children: ['★'.repeat(r.rating), '☆'.repeat(5 - r.rating)] }), _jsx("span", { className: "text-muted-foreground text-xs", children: new Date(r.createdAt).toLocaleDateString() })] })] })] }), r.comment && (_jsx("p", { className: "text-foreground mt-2 text-sm leading-relaxed", children: r.comment }))] }, r.id))) }))] })] }) }));
}
