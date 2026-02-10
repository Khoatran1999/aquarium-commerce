import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
/** Floating button that appears after scrolling down 400px */
export default function BackToTop() {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    return (_jsx(AnimatePresence, { children: visible && (_jsx(motion.button, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 }, onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }), "aria-label": "Back to top", className: "bg-primary hover:bg-primary-dark fixed bottom-5 right-5 z-50 flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg transition-colors", children: _jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M12 19V5M5 12l7-7 7 7" }) }) })) }));
}
