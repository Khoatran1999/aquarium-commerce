import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
export default function NotFoundPage() {
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsx("title", { children: "404 \u2013 AquaLuxe" }), _jsx("meta", { name: "robots", content: "noindex" })] }), _jsxs("div", { className: "mx-auto flex max-w-[1280px] flex-col items-center justify-center px-4 py-24 text-center md:px-10", children: [_jsx("h1", { className: "text-primary text-7xl font-black", children: "404" }), _jsx("p", { className: "text-muted-foreground mt-4 text-lg", children: "The page you are looking for does not exist." }), _jsx(Link, { to: "/", className: "bg-primary mt-6 inline-flex items-center rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105", children: "Back to Home" })] })] }));
}
