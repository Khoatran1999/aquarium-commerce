import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useProduct, useProducts, useReviews } from '../hooks';
import { useAppDispatch, useAppSelector } from '../store';
import { addToCart } from '../store/cart.slice';
import { Button, Skeleton, Badge, Tabs } from '@repo/ui';
import toast from 'react-hot-toast';
import ReviewSection from '../components/product/ReviewSection';
export default function ProductDetailPage() {
    const { slug } = useParams();
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((s) => s.auth);
    const { data: res, isLoading } = useProduct(slug ?? '');
    const product = res?.data;
    const { data: relatedRes } = useProducts(product ? { speciesId: product.speciesId, limit: 4 } : undefined);
    const related = (relatedRes?.data ?? []).filter((p) => p.id !== product?.id).slice(0, 4);
    const { data: reviewsRes } = useReviews(product?.id ?? '');
    const reviews = reviewsRes?.data ?? [];
    const [mainImage, setMainImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    if (isLoading) {
        return (_jsx("div", { className: "mx-auto max-w-[1280px] px-4 py-8 md:px-10", children: _jsxs("div", { className: "grid gap-10 md:grid-cols-2", children: [_jsx(Skeleton, { className: "aspect-square w-full rounded-2xl" }), _jsxs("div", { className: "flex flex-col gap-4", children: [_jsx(Skeleton, { className: "h-6 w-40" }), _jsx(Skeleton, { className: "h-10 w-3/4" }), _jsx(Skeleton, { className: "h-6 w-32" }), _jsx(Skeleton, { className: "h-12 w-48" })] })] }) }));
    }
    if (!product) {
        return (_jsxs("div", { className: "flex min-h-[60vh] flex-col items-center justify-center text-center", children: [_jsx("h2", { className: "text-foreground text-2xl font-bold", children: "Product not found" }), _jsx(Link, { to: "/products", className: "text-primary mt-4 hover:underline", children: "Browse all products" })] }));
    }
    const images = product.images ?? [];
    const currentImg = images[mainImage]?.url ?? '/placeholder-fish.jpg';
    const inStock = product.available > 0;
    const handleAddToCart = () => {
        dispatch(addToCart({ productId: product.id, quantity }))
            .unwrap()
            .then(() => toast.success(`${product.name} added to cart!`))
            .catch((err) => toast.error(err));
    };
    const sizeLabels = {
        XS: 'Extra Small (< 3cm)',
        S: 'Small (3–5cm)',
        M: 'Medium (5–10cm)',
        L: 'Large (10–20cm)',
        XL: 'Extra Large (> 20cm)',
    };
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsxs("title", { children: [product.name, " \u2013 AquaLuxe"] }), _jsx("meta", { name: "description", content: product.description?.slice(0, 160) ?? `Buy ${product.name} at AquaLuxe` }), _jsx("meta", { property: "og:title", content: `${product.name} – AquaLuxe` }), _jsx("meta", { property: "og:description", content: product.description?.slice(0, 160) ?? '' }), _jsx("meta", { property: "og:type", content: "product" }), product.images?.[0]?.url && _jsx("meta", { property: "og:image", content: product.images[0].url })] }), _jsxs("div", { className: "mx-auto max-w-[1280px] px-4 py-8 md:px-10", children: [_jsxs("nav", { className: "text-muted-foreground mb-6 flex items-center gap-2 text-sm", children: [_jsx(Link, { to: "/", className: "hover:text-primary", children: "Home" }), _jsx("span", { children: "/" }), _jsx(Link, { to: "/products", className: "hover:text-primary", children: "Products" }), _jsx("span", { children: "/" }), _jsx("span", { className: "text-foreground", children: product.name })] }), _jsxs("div", { className: "grid gap-10 md:grid-cols-2", children: [_jsxs("div", { children: [_jsx(motion.div, { className: "mb-4 aspect-square overflow-hidden rounded-2xl bg-gray-100", initial: { opacity: 0 }, animate: { opacity: 1 }, children: _jsx("img", { src: currentImg, alt: product.name, className: "h-full w-full object-cover" }) }, mainImage), images.length > 1 && (_jsx("div", { className: "flex gap-3", children: images.map((img, i) => (_jsx("button", { onClick: () => setMainImage(i), className: `h-20 w-20 overflow-hidden rounded-xl border-2 transition-colors ${i === mainImage ? 'border-primary' : 'border-transparent'}`, children: _jsx("img", { src: img.url, alt: img.alt ?? '', className: "h-full w-full object-cover" }) }, img.id))) }))] }), _jsxs("div", { className: "flex flex-col gap-4", children: [product.species && (_jsx("p", { className: "text-muted-foreground text-sm", children: product.species.name })), _jsx("h1", { className: "text-foreground text-3xl font-bold", children: product.name }), product.avgRating > 0 && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-accent", children: '★'.repeat(Math.round(product.avgRating)) }), _jsxs("span", { className: "text-muted-foreground text-sm", children: [product.avgRating.toFixed(1), " (", product.reviewCount, " reviews)"] })] })), _jsxs("div", { className: "flex items-baseline gap-3", children: [_jsxs("span", { className: "text-primary text-3xl font-bold", children: ["$", product.price.toFixed(2)] }), product.comparePrice && product.comparePrice > product.price && (_jsxs(_Fragment, { children: [_jsxs("span", { className: "text-muted-foreground text-lg line-through", children: ["$", product.comparePrice.toFixed(2)] }), _jsxs(Badge, { variant: "danger", children: ["-", Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100), "%"] })] }))] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-foreground text-sm font-semibold", children: "Size:" }), _jsx(Badge, { children: sizeLabels[product.size] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `h-2 w-2 rounded-full ${inStock ? 'bg-success' : 'bg-danger'}` }), _jsx("span", { className: `text-sm font-medium ${inStock ? 'text-success' : 'text-danger'}`, children: inStock ? `${product.available} in stock` : 'Out of stock' })] }), _jsxs("div", { className: "mt-2 flex items-center gap-4", children: [_jsxs("div", { className: "border-border flex items-center rounded-xl border", children: [_jsx("button", { onClick: () => setQuantity((q) => Math.max(1, q - 1)), className: "text-foreground hover:bg-muted h-12 w-12 text-lg font-semibold transition-colors", children: "-" }), _jsx("span", { className: "text-foreground w-12 text-center font-semibold", children: quantity }), _jsx("button", { onClick: () => setQuantity((q) => Math.min(product.available, q + 1)), className: "text-foreground hover:bg-muted h-12 w-12 text-lg font-semibold transition-colors", children: "+" })] }), _jsx(Button, { size: "lg", className: "flex-1", disabled: !inStock, onClick: handleAddToCart, children: inStock ? 'Add to Cart' : 'Out of Stock' })] }), product.species && (_jsxs("div", { className: "border-border mt-4 grid grid-cols-2 gap-3 rounded-xl border p-4", children: [_jsx(InfoRow, { label: "Water Type", value: product.species.waterType }), _jsx(InfoRow, { label: "Care Level", value: product.species.careLevel }), _jsx(InfoRow, { label: "Temperament", value: product.species.temperament }), product.species.minTankSize && (_jsx(InfoRow, { label: "Min Tank", value: `${product.species.minTankSize}L` })), product.age && _jsx(InfoRow, { label: "Age", value: product.age }), product.gender && _jsx(InfoRow, { label: "Gender", value: product.gender })] }))] })] }), _jsx("div", { className: "mt-12", children: _jsx(Tabs, { items: [
                                {
                                    value: 'description',
                                    label: 'Description',
                                    content: (_jsx("div", { className: "text-foreground prose max-w-none py-6 leading-relaxed", children: _jsx("p", { children: product.description }) })),
                                },
                                {
                                    value: 'care',
                                    label: 'Care Guide',
                                    content: (_jsx("div", { className: "py-6", children: product.species ? (_jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [product.species.minTemp != null && product.species.maxTemp != null && (_jsx(CareCard, { icon: "\uD83C\uDF21\uFE0F", title: "Temperature", value: `${product.species.minTemp}°C – ${product.species.maxTemp}°C` })), product.species.minPh != null && product.species.maxPh != null && (_jsx(CareCard, { icon: "\u2697\uFE0F", title: "pH Level", value: `${product.species.minPh} – ${product.species.maxPh}` })), product.species.minTankSize && (_jsx(CareCard, { icon: "\uD83D\uDC20", title: "Min Tank Size", value: `${product.species.minTankSize} liters` })), product.species.maxSize && (_jsx(CareCard, { icon: "\uD83D\uDCCF", title: "Max Size", value: `${product.species.maxSize} cm` })), product.species.diet && (_jsx(CareCard, { icon: "\uD83C\uDF7D\uFE0F", title: "Diet", value: product.species.diet })), product.species.lifespan && (_jsx(CareCard, { icon: "\u23F3", title: "Lifespan", value: product.species.lifespan })), product.species.origin && (_jsx(CareCard, { icon: "\uD83C\uDF0D", title: "Origin", value: product.species.origin })), _jsx(CareCard, { icon: "\uD83D\uDCA7", title: "Water Type", value: product.species.waterType.replace('_', ' ') })] })) : (_jsx("p", { className: "text-muted-foreground", children: "No care information available." })) })),
                                },
                                {
                                    value: 'reviews',
                                    label: `Reviews (${product.reviewCount})`,
                                    content: (_jsx(ReviewSection, { productId: product.id, reviews: reviews, avgRating: product.avgRating, reviewCount: product.reviewCount, isAuthenticated: isAuthenticated })),
                                },
                            ] }) }), related.length > 0 && (_jsxs("section", { className: "mt-16", children: [_jsx("h2", { className: "text-foreground mb-6 text-2xl font-bold", children: "Related Fish" }), _jsx("div", { className: "grid grid-cols-2 gap-5 md:grid-cols-4", children: related.map((p) => (_jsxs(Link, { to: `/products/${p.slug}`, className: "bg-card border-border shadow-card hover:shadow-elevated group block overflow-hidden rounded-2xl border transition-all hover:-translate-y-1", children: [_jsx("div", { className: "aspect-square overflow-hidden", children: _jsx("img", { src: p.images?.[0]?.url ?? '/placeholder-fish.jpg', alt: p.name, className: "h-full w-full object-cover transition-transform duration-300 group-hover:scale-110", loading: "lazy" }) }), _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "text-foreground line-clamp-1 text-sm font-semibold", children: p.name }), _jsxs("span", { className: "text-primary mt-1 block font-bold", children: ["$", p.price.toFixed(2)] })] })] }, p.id))) })] }))] })] }));
}
/* ── Small helper components ─── */
function InfoRow({ label, value }) {
    return (_jsxs("div", { children: [_jsx("span", { className: "text-muted-foreground text-xs", children: label }), _jsx("p", { className: "text-foreground text-sm font-medium capitalize", children: value.toLowerCase().replace(/_/g, ' ') })] }));
}
function CareCard({ icon, title, value }) {
    return (_jsxs("div", { className: "bg-muted/50 flex items-start gap-3 rounded-xl p-4", children: [_jsx("span", { className: "text-2xl", children: icon }), _jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground text-xs", children: title }), _jsx("p", { className: "text-foreground text-sm font-semibold", children: value })] })] }));
}
