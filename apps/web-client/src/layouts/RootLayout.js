import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/ScrollToTop';
import BackToTop from '../components/BackToTop';
const pageVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
};
export default function RootLayout() {
    const location = useLocation();
    return (_jsxs("div", { className: "flex min-h-screen flex-col", children: [_jsx("a", { href: "#main-content", className: "bg-primary sr-only text-white focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[100] focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg", children: "Skip to main content" }), _jsx(ScrollToTop, {}), _jsx(Header, {}), _jsx("main", { id: "main-content", className: "flex-1", role: "main", children: _jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { variants: pageVariants, initial: "initial", animate: "animate", exit: "exit", transition: { duration: 0.2, ease: 'easeOut' }, children: _jsx(Outlet, {}) }, location.pathname) }) }), _jsx(Footer, {}), _jsx(BackToTop, {})] }));
}
