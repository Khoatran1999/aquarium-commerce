import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
const FOOTER_SECTIONS = [
    {
        title: 'Shop',
        links: [
            { label: 'Freshwater Fish', href: '/products?waterType=FRESHWATER' },
            { label: 'Saltwater Fish', href: '/products?waterType=SALTWATER' },
            { label: 'Mini Fish', href: '/products?size=S' },
            { label: 'All Products', href: '/products' },
        ],
    },
    {
        title: 'Support',
        links: [
            { label: 'Care Guides', href: '/products' },
            { label: 'Return Policy', href: '#' },
            { label: 'Shipping Info', href: '#' },
            { label: 'Contact Us', href: '#' },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'About Us', href: '#' },
            { label: 'AI Advisor', href: '/ai-chat' },
            { label: 'Terms of Service', href: '#' },
            { label: 'Privacy Policy', href: '#' },
        ],
    },
];
export default function Footer() {
    return (_jsx("footer", { className: "border-border bg-card border-t", children: _jsxs("div", { className: "mx-auto max-w-[1280px] px-4 py-12 md:px-10", children: [_jsxs("div", { className: "grid grid-cols-2 gap-8 md:grid-cols-4", children: [_jsxs("div", { className: "col-span-2 md:col-span-1", children: [_jsxs(Link, { to: "/", className: "text-primary flex items-center gap-2", children: [_jsx("svg", { className: "h-7 w-7", viewBox: "0 0 48 48", fill: "none", children: _jsx("path", { d: "M42.17 20.17L27.83 5.83c1.31 1.31.57 4.36-1.63 7.94a38.3 38.3 0 0 1-5.55 6.89 38.3 38.3 0 0 1-6.89 5.55c-3.58 2.2-6.63 2.93-7.94 1.63L20.17 42.17c1.31 1.31 4.36.57 7.94-1.63a38.3 38.3 0 0 0 6.89-5.55 38.3 38.3 0 0 0 5.55-6.89c2.2-3.58 2.93-6.63 1.63-7.94z", fill: "currentColor" }) }), _jsx("span", { className: "text-foreground text-lg font-bold", children: "AquaLuxe" })] }), _jsx("p", { className: "text-muted-foreground mt-3 text-sm leading-relaxed", children: "Premium ornamental fish, delivered nationwide. Wide variety of species with guaranteed quality and live arrival." }), _jsx("div", { className: "mt-4 flex gap-3", children: ['facebook', 'instagram', 'youtube'].map((s) => (_jsx("a", { href: "#", className: "bg-muted text-muted-foreground hover:text-primary hover:bg-primary/10 flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold uppercase transition-colors", "aria-label": s, children: s[0].toUpperCase() }, s))) })] }), FOOTER_SECTIONS.map((section) => (_jsxs("div", { children: [_jsx("h4", { className: "text-foreground mb-3 text-sm font-semibold", children: section.title }), _jsx("ul", { className: "space-y-2", children: section.links.map((link) => (_jsx("li", { children: _jsx(Link, { to: link.href, className: "text-muted-foreground hover:text-primary text-sm transition-colors", children: link.label }) }, link.label))) })] }, section.title)))] }), _jsxs("div", { className: "border-border text-muted-foreground mt-10 border-t pt-6 text-center text-xs", children: ["\u00A9 ", new Date().getFullYear(), " AquaLuxe. All rights reserved."] })] }) }));
}
