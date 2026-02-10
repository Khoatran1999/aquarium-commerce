import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts, useSpeciesList } from '../hooks';
import { useAppDispatch } from '../store';
import { addToCart } from '../store/cart.slice';
import { Button, Skeleton, Pagination, Badge } from '@repo/ui';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';
/* ── Filter option constants ──────────── */
const SIZE_OPTIONS = [
    { value: 'XS', label: 'XS' },
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
];
const WATER_OPTIONS = [
    { value: 'FRESHWATER', label: 'Freshwater' },
    { value: 'SALTWATER', label: 'Saltwater' },
    { value: 'BRACKISH', label: 'Brackish' },
];
const CARE_OPTIONS = [
    { value: 'EASY', label: 'Easy' },
    { value: 'MODERATE', label: 'Moderate' },
    { value: 'HARD', label: 'Hard' },
    { value: 'EXPERT', label: 'Expert' },
];
const TEMPERAMENT_OPTIONS = [
    { value: 'PEACEFUL', label: 'Peaceful' },
    { value: 'SEMI_AGGRESSIVE', label: 'Semi-Aggressive' },
    { value: 'AGGRESSIVE', label: 'Aggressive' },
];
const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest' },
    { value: 'price_asc', label: 'Price: Low → High' },
    { value: 'price_desc', label: 'Price: High → Low' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Best Rated' },
];
function parseList(val) {
    return val ? val.split(',').filter(Boolean) : [];
}
export default function ProductListingPage() {
    const dispatch = useAppDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    /* ── Read filters from URL ────── */
    const filters = useMemo(() => ({
        search: searchParams.get('search') ?? undefined,
        speciesId: searchParams.get('speciesId') ?? undefined,
        size: parseList(searchParams.get('size')),
        waterType: parseList(searchParams.get('waterType')),
        careLevel: parseList(searchParams.get('careLevel')),
        temperament: parseList(searchParams.get('temperament')),
        minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
        maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
        sortBy: searchParams.get('sortBy') ?? 'newest',
        page: Number(searchParams.get('page') ?? 1),
        limit: 12,
    }), [searchParams]);
    const { data: response, isLoading } = useProducts(filters);
    const { data: speciesResponse } = useSpeciesList();
    const products = response?.data ?? [];
    const meta = response?.meta;
    const speciesList = speciesResponse?.data ?? [];
    /* ── Filter helpers ─────────── */
    const updateParam = useCallback((key, value) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (value === null || (Array.isArray(value) && value.length === 0)) {
                next.delete(key);
            }
            else {
                next.set(key, Array.isArray(value) ? value.join(',') : value);
            }
            next.delete('page'); // reset page on filter change
            return next;
        });
    }, [setSearchParams]);
    const toggleArrayParam = useCallback((key, val) => {
        const current = parseList(searchParams.get(key));
        const next = current.includes(val) ? current.filter((v) => v !== val) : [...current, val];
        updateParam(key, next);
    }, [searchParams, updateParam]);
    const clearAllFilters = useCallback(() => {
        setSearchParams({});
    }, [setSearchParams]);
    const activeFilterCount = [
        filters.search,
        filters.speciesId,
        filters.minPrice,
        filters.maxPrice,
        ...(filters.size ?? []),
        ...(filters.waterType ?? []),
        ...(filters.careLevel ?? []),
        ...(filters.temperament ?? []),
    ].filter(Boolean).length;
    const handleAddToCart = (productId) => {
        dispatch(addToCart({ productId, quantity: 1 }))
            .unwrap()
            .then(() => toast.success('Added to cart!'))
            .catch((err) => toast.error(err));
    };
    /* ── Sidebar filter UI ──────── */
    const FilterSidebar = (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "text-foreground mb-2 block text-sm font-semibold", children: "Search" }), _jsx("input", { type: "text", defaultValue: filters.search ?? '', placeholder: "Search fish...", className: "border-border bg-background text-foreground focus:border-primary h-10 w-full rounded-lg border px-3 text-sm outline-none transition-colors", onKeyDown: (e) => {
                            if (e.key === 'Enter') {
                                const v = e.target.value.trim();
                                updateParam('search', v || null);
                            }
                        } })] }), speciesList.length > 0 && (_jsxs("div", { children: [_jsx("label", { className: "text-foreground mb-2 block text-sm font-semibold", children: "Species" }), _jsxs("select", { value: filters.speciesId ?? '', onChange: (e) => updateParam('speciesId', e.target.value || null), className: "border-border bg-background text-foreground focus:border-primary h-10 w-full rounded-lg border px-3 text-sm outline-none", children: [_jsx("option", { value: "", children: "All Species" }), speciesList.map((s) => (_jsx("option", { value: s.id, children: s.name }, s.id)))] })] })), _jsxs("div", { children: [_jsx("label", { className: "text-foreground mb-2 block text-sm font-semibold", children: "Price Range" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "number", min: 0, placeholder: "Min", defaultValue: filters.minPrice ?? '', className: "border-border bg-background text-foreground focus:border-primary h-10 w-full rounded-lg border px-3 text-sm outline-none", onBlur: (e) => updateParam('minPrice', e.target.value || null) }), _jsx("input", { type: "number", min: 0, placeholder: "Max", defaultValue: filters.maxPrice ?? '', className: "border-border bg-background text-foreground focus:border-primary h-10 w-full rounded-lg border px-3 text-sm outline-none", onBlur: (e) => updateParam('maxPrice', e.target.value || null) })] })] }), _jsx(FilterCheckboxGroup, { label: "Size", options: SIZE_OPTIONS, selected: filters.size ?? [], onToggle: (v) => toggleArrayParam('size', v) }), _jsx(FilterCheckboxGroup, { label: "Water Type", options: WATER_OPTIONS, selected: filters.waterType ?? [], onToggle: (v) => toggleArrayParam('waterType', v) }), _jsx(FilterCheckboxGroup, { label: "Care Level", options: CARE_OPTIONS, selected: filters.careLevel ?? [], onToggle: (v) => toggleArrayParam('careLevel', v) }), _jsx(FilterCheckboxGroup, { label: "Temperament", options: TEMPERAMENT_OPTIONS, selected: filters.temperament ?? [], onToggle: (v) => toggleArrayParam('temperament', v) }), activeFilterCount > 0 && (_jsxs(Button, { variant: "outline", size: "sm", onClick: clearAllFilters, className: "w-full", children: ["Clear All Filters (", activeFilterCount, ")"] }))] }));
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsx("title", { children: "Products \u2013 AquaLuxe" }), _jsx("meta", { name: "description", content: "Browse our collection of premium ornamental fish. Filter by species, size, water type and more." }), _jsx("meta", { property: "og:title", content: "Products \u2013 AquaLuxe" }), _jsx("meta", { property: "og:type", content: "website" })] }), _jsxs("div", { className: "mx-auto max-w-[1280px] px-4 py-8 md:px-10", children: [_jsxs("div", { className: "mb-6 flex flex-wrap items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-foreground text-2xl font-bold", children: "All Products" }), meta && (_jsxs("p", { className: "text-muted-foreground mt-1 text-sm", children: [meta.total, " product", meta.total !== 1 ? 's' : '', " found"] }))] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs(Button, { variant: "outline", size: "sm", className: "md:hidden", onClick: () => setShowMobileFilters(true), children: ["Filters ", activeFilterCount > 0 && _jsx(Badge, { className: "ml-1", children: activeFilterCount })] }), _jsx("select", { value: filters.sortBy, onChange: (e) => updateParam('sortBy', e.target.value), className: "border-border bg-background text-foreground h-9 rounded-lg border px-3 text-sm", children: SORT_OPTIONS.map((o) => (_jsx("option", { value: o.value, children: o.label }, o.value))) }), _jsxs("div", { className: "border-border hidden items-center rounded-lg border md:flex", children: [_jsx("button", { onClick: () => setViewMode('grid'), className: `p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-muted-foreground'} rounded-l-lg transition-colors`, children: _jsx(GridIcon, {}) }), _jsx("button", { onClick: () => setViewMode('list'), className: `p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-muted-foreground'} rounded-r-lg transition-colors`, children: _jsx(ListIcon, {}) })] })] })] }), _jsxs("div", { className: "flex gap-8", children: [_jsx("aside", { className: "hidden w-64 shrink-0 md:block", children: FilterSidebar }), _jsxs("div", { className: "min-w-0 flex-1", children: [isLoading ? (_jsx("div", { className: viewMode === 'grid'
                                            ? 'grid grid-cols-2 gap-5 lg:grid-cols-3'
                                            : 'flex flex-col gap-4', children: Array.from({ length: 6 }).map((_, i) => (_jsxs("div", { className: "bg-card rounded-2xl p-4", children: [_jsx(Skeleton, { className: "mb-4 aspect-square w-full rounded-xl" }), _jsx(Skeleton, { className: "mb-2 h-4 w-3/4" }), _jsx(Skeleton, { className: "h-4 w-1/2" })] }, i))) })) : products.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-center", children: [_jsx("div", { className: "text-muted-foreground mb-4 text-6xl", children: "\uD83D\uDC1F" }), _jsx("h3", { className: "text-foreground text-lg font-semibold", children: "No products found" }), _jsx("p", { className: "text-muted-foreground mt-2 text-sm", children: "Try adjusting your filters or search terms." }), activeFilterCount > 0 && (_jsx(Button, { variant: "outline", className: "mt-4", onClick: clearAllFilters, children: "Clear Filters" }))] })) : (_jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 }, className: viewMode === 'grid'
                                                ? 'grid grid-cols-2 gap-5 lg:grid-cols-3'
                                                : 'flex flex-col gap-4', children: products.map((p) => viewMode === 'grid' ? (_jsx(ProductCard, { product: p, showAddToCart: true }, p.id)) : (_jsxs(Link, { to: `/products/${p.slug}`, className: "bg-card border-border shadow-card hover:shadow-elevated group flex gap-5 overflow-hidden rounded-2xl border p-4 transition-all", children: [_jsx("div", { className: "h-32 w-32 shrink-0 overflow-hidden rounded-xl", children: _jsx("img", { src: p.images?.[0]?.url ?? '/placeholder-fish.jpg', alt: p.name, className: "h-full w-full object-cover", loading: "lazy" }) }), _jsxs("div", { className: "flex min-w-0 flex-1 flex-col justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground text-xs", children: p.species?.name }), _jsx("h3", { className: "text-foreground mt-1 text-lg font-semibold", children: p.name }), _jsx("p", { className: "text-muted-foreground mt-1 line-clamp-2 text-sm", children: p.description })] }), _jsxs("div", { className: "mt-2 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-baseline gap-2", children: [_jsxs("span", { className: "text-primary text-xl font-bold", children: ["$", p.price.toFixed(2)] }), p.comparePrice && p.comparePrice > p.price && (_jsxs("span", { className: "text-muted-foreground text-sm line-through", children: ["$", p.comparePrice.toFixed(2)] }))] }), _jsx(Button, { size: "sm", onClick: (e) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            handleAddToCart(p.id);
                                                                        }, children: "Add to Cart" })] })] })] }, p.id))) }, viewMode + JSON.stringify(filters)) })), meta && meta.totalPages > 1 && (_jsx("div", { className: "mt-8 flex justify-center", children: _jsx(Pagination, { page: meta.page, totalPages: meta.totalPages, onPageChange: (p) => {
                                                setSearchParams((prev) => {
                                                    const next = new URLSearchParams(prev);
                                                    next.set('page', String(p));
                                                    return next;
                                                });
                                            } }) }))] })] })] }), _jsx(AnimatePresence, { children: showMobileFilters && (_jsxs(_Fragment, { children: [_jsx(motion.div, { className: "fixed inset-0 z-50 bg-black/40", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: () => setShowMobileFilters(false) }), _jsxs(motion.aside, { className: "bg-card fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-3xl p-6", initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' }, transition: { type: 'spring', damping: 30, stiffness: 300 }, children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsx("h3", { className: "text-foreground text-lg font-bold", children: "Filters" }), _jsx("button", { onClick: () => setShowMobileFilters(false), className: "text-muted-foreground p-2", children: "\u2715" })] }), FilterSidebar, _jsx(Button, { className: "mt-6 w-full", onClick: () => setShowMobileFilters(false), children: "Apply Filters" })] })] })) })] }));
}
/* ── Helper Components ─── */
function FilterCheckboxGroup({ label, options, selected, onToggle, }) {
    return (_jsxs("div", { children: [_jsx("label", { className: "text-foreground mb-2 block text-sm font-semibold", children: label }), _jsx("div", { className: "flex flex-wrap gap-2", children: options.map((o) => (_jsx("button", { onClick: () => onToggle(o.value), className: `rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${selected.includes(o.value)
                        ? 'bg-primary border-primary text-white'
                        : 'border-border text-muted-foreground hover:border-primary hover:text-primary'}`, children: o.label }, o.value))) })] }));
}
function GridIcon() {
    return (_jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" }) }));
}
function ListIcon() {
    return (_jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 6h16M4 12h16M4 18h16" }) }));
}
