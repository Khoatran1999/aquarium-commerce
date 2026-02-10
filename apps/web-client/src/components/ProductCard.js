import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { addToCart } from '../store/cart.slice';
import { Button } from '@repo/ui';
import toast from 'react-hot-toast';
/**
 * Shared product card used across HomePage, ProductListingPage, SearchPage.
 * Wrapped with React.memo to prevent unnecessary re-renders in large lists.
 */
const ProductCard = memo(function ProductCard({ product, showAddToCart = false, }) {
    const dispatch = useAppDispatch();
    const img = product.images?.find((i) => i.isPrimary)?.url ?? product.images?.[0]?.url;
    const handleAdd = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart({ productId: product.id, quantity: 1 }));
        toast.success(`${product.name} added to cart`);
    }, [dispatch, product.id, product.name]);
    const hasDiscount = product.comparePrice && product.comparePrice > product.price;
    return (_jsxs(Link, { to: `/products/${product.slug}`, className: "bg-card border-border shadow-card hover:shadow-elevated group block overflow-hidden rounded-2xl border transition-all hover:-translate-y-1", children: [_jsxs("div", { className: "relative aspect-square overflow-hidden", children: [img ? (_jsx("img", { src: img, alt: product.name, className: "h-full w-full object-cover transition-transform duration-300 group-hover:scale-110", loading: "lazy" })) : (_jsx("div", { className: "bg-muted flex h-full w-full items-center justify-center text-4xl", children: "\uD83D\uDC1F" })), hasDiscount && (_jsxs("span", { className: "bg-danger absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold text-white", children: ["-", Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100), "%"] }))] }), _jsxs("div", { className: "p-4", children: [_jsx("p", { className: "text-muted-foreground text-xs", children: product.species?.name }), _jsx("h3", { className: "text-foreground mt-1 line-clamp-1 text-sm font-semibold", children: product.name }), _jsxs("div", { className: "mt-2 flex items-baseline gap-2", children: [_jsxs("span", { className: "text-primary text-lg font-bold", children: ["$", product.price.toFixed(2)] }), hasDiscount && (_jsxs("span", { className: "text-muted-foreground text-xs line-through", children: ["$", product.comparePrice.toFixed(2)] }))] }), product.avgRating > 0 && (_jsxs("div", { className: "mt-1.5 flex items-center gap-1", children: [_jsx("span", { className: "text-accent text-xs", children: "\u2605" }), _jsxs("span", { className: "text-muted-foreground text-xs", children: [product.avgRating.toFixed(1), " (", product.reviewCount, ")"] })] })), showAddToCart && (_jsxs("div", { className: "mt-3 flex items-center justify-between", children: [_jsx("span", { className: "text-muted-foreground text-xs", children: product.available > 0 ? `${product.available} in stock` : 'Out of stock' }), _jsx(Button, { size: "sm", onClick: handleAdd, disabled: product.available <= 0, children: product.available > 0 ? 'Add to Cart' : 'Sold Out' })] }))] })] }));
});
export default ProductCard;
