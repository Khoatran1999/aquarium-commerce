import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Helmet } from 'react-helmet-async';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { productService } from '@repo/services';
import { Skeleton, Button } from '@repo/ui';
import { queryKeys } from '../hooks';
import ProductCard from '../components/ProductCard';
export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const q = searchParams.get('q') ?? '';
    const { data, isLoading } = useQuery({
        queryKey: [...queryKeys.products.all, 'search', q],
        queryFn: () => productService.getProducts({ search: q, limit: 20 }),
        enabled: q.length > 0,
    });
    const products = data?.data ?? [];
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsxs("title", { children: [q ? `"${q}" – Search` : 'Search', " \u2013 AquaLuxe"] }), _jsx("meta", { name: "robots", content: "noindex" })] }), _jsxs("div", { className: "mx-auto max-w-[1280px] px-4 py-8 md:px-10", children: [q ? (_jsxs("div", { className: "mb-8", children: [_jsxs("h1", { className: "text-foreground text-2xl font-bold", children: ["Search results for \u201C", q, "\u201D"] }), !isLoading && (_jsxs("p", { className: "text-muted-foreground mt-1 text-sm", children: [products.length, " ", products.length === 1 ? 'result' : 'results', " found"] }))] })) : (_jsxs("div", { className: "flex min-h-[40vh] flex-col items-center justify-center text-center", children: [_jsx("p", { className: "text-5xl", children: "\uD83D\uDD0D" }), _jsx("h1", { className: "text-foreground mt-4 text-xl font-bold", children: "Search Products" }), _jsx("p", { className: "text-muted-foreground mt-2", children: "Enter a search term to find your perfect fish." })] })), isLoading && (_jsx("div", { className: "grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4", children: Array.from({ length: 8 }).map((_, i) => (_jsx(Skeleton, { className: "aspect-square rounded-2xl" }, i))) })), !isLoading && q && products.length === 0 && (_jsxs("div", { className: "py-20 text-center", children: [_jsx("p", { className: "text-5xl", children: "\uD83D\uDC20" }), _jsx("p", { className: "text-foreground mt-3 text-lg font-semibold", children: "No results found" }), _jsx("p", { className: "text-muted-foreground mt-1 text-sm", children: "Try a different search term or browse our collection." }), _jsx(Link, { to: "/products", children: _jsx(Button, { variant: "outline", className: "mt-4", children: "Browse All Products" }) })] })), !isLoading && products.length > 0 && (_jsx("div", { className: "grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4", children: products.map((product) => (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, children: _jsx(ProductCard, { product: product, showAddToCart: true }) }, product.id))) }))] })] }));
}
