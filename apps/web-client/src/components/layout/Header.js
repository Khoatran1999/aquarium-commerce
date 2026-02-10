import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store';
import { toggleTheme, toggleMobileMenu, closeMobileMenu } from '../../store/ui.slice';
import { logout } from '../../store/auth.slice';
const NAV_LINKS = [
    { label: 'Shop', href: '/products' },
    { label: 'Species', href: '/products?category=species' },
    { label: 'AI Advisor', href: '/ai-chat' },
];
export default function Header() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { theme, mobileMenuOpen } = useAppSelector((s) => s.ui);
    const { isAuthenticated, user } = useAppSelector((s) => s.auth);
    const { itemCount } = useAppSelector((s) => s.cart);
    /* User dropdown state */
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    /* Mini cart dropdown */
    const [cartOpen, setCartOpen] = useState(false);
    const cartRef = useRef(null);
    const cartItems = useAppSelector((s) => s.cart.items);
    const cartSubtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    /* Track itemCount changes for bounce animation */
    const [cartBounce, setCartBounce] = useState(false);
    const prevItemCount = useRef(itemCount);
    useEffect(() => {
        if (itemCount > prevItemCount.current) {
            setCartBounce(true);
            const t = setTimeout(() => setCartBounce(false), 400);
            return () => clearTimeout(t);
        }
        prevItemCount.current = itemCount;
    }, [itemCount]);
    /* Close dropdowns on outside click */
    useEffect(() => {
        function handleClickOutside(e) {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
            if (cartRef.current && !cartRef.current.contains(e.target)) {
                setCartOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handleLogout = () => {
        dispatch(logout());
        setUserMenuOpen(false);
        navigate('/');
    };
    return (_jsxs(_Fragment, { children: [_jsx("header", { className: "border-primary/20 dark:border-border sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md dark:bg-[#0c2a35]/90", children: _jsxs("div", { className: "mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-3 md:px-10", children: [_jsxs(Link, { to: "/", className: "text-primary flex items-center gap-2", children: [_jsx("svg", { className: "h-8 w-8", viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M42.17 20.17L27.83 5.83c1.31 1.31.57 4.36-1.63 7.94a38.3 38.3 0 0 1-5.55 6.89 38.3 38.3 0 0 1-6.89 5.55c-3.58 2.2-6.63 2.93-7.94 1.63L20.17 42.17c1.31 1.31 4.36.57 7.94-1.63a38.3 38.3 0 0 0 6.89-5.55 38.3 38.3 0 0 0 5.55-6.89c2.2-3.58 2.93-6.63 1.63-7.94z", fill: "currentColor" }) }), _jsx("span", { className: "text-foreground text-xl font-bold tracking-tight", children: "AquaLuxe" })] }), _jsx("nav", { className: "hidden items-center gap-8 md:flex", children: NAV_LINKS.map((link) => (_jsx(Link, { to: link.href, className: "text-foreground hover:text-secondary text-sm font-medium transition-colors", children: link.label }, link.href))) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("label", { className: "bg-muted focus-within:border-primary hidden h-10 w-64 items-center rounded-full border border-transparent px-4 transition-all lg:flex", children: [_jsx(SearchIcon, { className: "text-muted-foreground h-5 w-5" }), _jsx("input", { className: "placeholder-muted-foreground ml-2 w-full border-none bg-transparent text-sm focus:outline-none focus:ring-0", placeholder: "Search fish species...", onKeyDown: (e) => {
                                                if (e.key === 'Enter') {
                                                    const v = e.target.value.trim();
                                                    if (v)
                                                        navigate(`/search?q=${encodeURIComponent(v)}`);
                                                }
                                            } })] }), _jsx("button", { onClick: () => dispatch(toggleTheme()), className: "hover:bg-primary/10 rounded-full p-2 transition-colors", "aria-label": "Toggle theme", children: theme === 'light' ? _jsx(MoonIcon, {}) : _jsx(SunIcon, {}) }), _jsxs("div", { className: "relative", ref: cartRef, children: [_jsxs("button", { onClick: () => setCartOpen((p) => !p), className: "hover:bg-primary/10 relative rounded-full p-2 transition-colors", "aria-label": "Cart", children: [_jsx(CartIcon, {}), itemCount > 0 && (_jsx(motion.span, { className: "bg-secondary absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white", animate: cartBounce ? { scale: [1, 1.4, 1] } : {}, transition: { duration: 0.3 }, children: itemCount > 99 ? '99+' : itemCount }, itemCount))] }), _jsx(AnimatePresence, { children: cartOpen && (_jsx(motion.div, { initial: { opacity: 0, y: 8, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 8, scale: 0.95 }, transition: { duration: 0.15 }, className: "bg-card border-border shadow-elevated absolute right-0 top-full mt-2 w-80 rounded-xl border p-4", children: cartItems.length === 0 ? (_jsxs("div", { className: "py-6 text-center", children: [_jsx("p", { className: "text-muted-foreground text-sm", children: "Your cart is empty" }), _jsx(Link, { to: "/products", onClick: () => setCartOpen(false), className: "text-primary mt-2 inline-block text-sm font-medium hover:underline", children: "Browse Products" })] })) : (_jsxs(_Fragment, { children: [_jsxs("p", { className: "text-foreground mb-3 text-sm font-semibold", children: ["Cart (", itemCount, " ", itemCount === 1 ? 'item' : 'items', ")"] }), _jsxs("div", { className: "flex max-h-60 flex-col gap-3 overflow-y-auto", children: [cartItems.slice(0, 3).map((item) => (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("img", { src: item.product?.images?.[0]?.url ?? '/placeholder-fish.jpg', alt: item.product?.name ?? '', className: "h-11 w-11 rounded-lg object-cover" }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "text-foreground line-clamp-1 text-xs font-medium", children: item.product?.name }), _jsxs("p", { className: "text-muted-foreground text-xs", children: [item.quantity, " \u00D7 $", item.price.toFixed(2)] })] }), _jsxs("span", { className: "text-foreground text-xs font-semibold", children: ["$", (item.price * item.quantity).toFixed(2)] })] }, item.id))), cartItems.length > 3 && (_jsxs("p", { className: "text-muted-foreground text-center text-xs", children: ["+", cartItems.length - 3, " more", ' ', cartItems.length - 3 === 1 ? 'item' : 'items'] }))] }), _jsxs("div", { className: "border-border mt-3 border-t pt-3", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Subtotal" }), _jsxs("span", { className: "text-foreground font-semibold", children: ["$", cartSubtotal.toFixed(2)] })] }), _jsxs("div", { className: "mt-3 flex gap-2", children: [_jsx(Link, { to: "/cart", onClick: () => setCartOpen(false), className: "border-border text-foreground hover:bg-muted flex-1 rounded-lg border py-2 text-center text-xs font-medium transition-colors", children: "View Cart" }), _jsx(Link, { to: "/checkout", onClick: () => setCartOpen(false), className: "bg-primary flex-1 rounded-lg py-2 text-center text-xs font-medium text-white transition-colors hover:opacity-90", children: "Checkout" })] })] })] })) })) })] }), isAuthenticated ? (_jsxs("div", { className: "relative", ref: userMenuRef, children: [_jsx("button", { onClick: () => setUserMenuOpen((p) => !p), className: "hover:bg-primary/10 flex items-center gap-2 rounded-full p-1.5 transition-colors", "aria-label": "User menu", children: user?.avatar ? (_jsx("img", { src: user.avatar, alt: user.name, className: "h-7 w-7 rounded-full object-cover" })) : (_jsx("span", { className: "bg-primary flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white", children: user?.name?.charAt(0).toUpperCase() ?? 'U' })) }), userMenuOpen && (_jsxs("div", { className: "bg-card border-border shadow-elevated absolute right-0 top-full mt-2 w-56 rounded-xl border py-2", children: [_jsxs("div", { className: "border-border border-b px-4 py-2.5", children: [_jsx("p", { className: "text-foreground truncate text-sm font-semibold", children: user?.name }), _jsx("p", { className: "text-muted-foreground truncate text-xs", children: user?.email })] }), _jsxs(Link, { to: "/profile", onClick: () => setUserMenuOpen(false), className: "text-foreground hover:bg-muted flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors", children: [_jsx(UserIcon, { className: "h-4 w-4" }), " Profile"] }), _jsxs(Link, { to: "/orders", onClick: () => setUserMenuOpen(false), className: "text-foreground hover:bg-muted flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors", children: [_jsx(OrderIcon, { className: "h-4 w-4" }), " My Orders"] }), _jsx("div", { className: "border-border my-1 border-t" }), _jsxs("button", { onClick: handleLogout, className: "text-danger hover:bg-danger/5 flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors", children: [_jsx(LogoutIcon, { className: "h-4 w-4" }), " Sign out"] })] }))] })) : (_jsx(Link, { to: "/login", className: "hover:bg-primary/10 rounded-full p-2 transition-colors", "aria-label": "Sign in", children: _jsx(UserIcon, {}) })), _jsx("button", { className: "hover:bg-primary/10 rounded-full p-2 transition-colors md:hidden", onClick: () => dispatch(toggleMobileMenu()), "aria-label": "Menu", children: _jsx(MenuIcon, {}) })] })] }) }), mobileMenuOpen && (_jsxs("div", { className: "fixed inset-0 z-[60] md:hidden", children: [_jsx("div", { className: "absolute inset-0 bg-black/40", onClick: () => dispatch(closeMobileMenu()) }), _jsxs("nav", { className: "bg-card shadow-elevated absolute right-0 top-0 h-full w-72 p-6", children: [_jsxs("div", { className: "mb-8 flex items-center justify-between", children: [_jsx("span", { className: "text-foreground text-lg font-bold", children: "Menu" }), _jsx("button", { onClick: () => dispatch(closeMobileMenu()), children: _jsx(CloseIcon, {}) })] }), _jsxs("div", { className: "flex flex-col gap-4", children: [NAV_LINKS.map((link) => (_jsx(Link, { to: link.href, onClick: () => dispatch(closeMobileMenu()), className: "text-foreground hover:text-primary text-base font-medium transition-colors", children: link.label }, link.href))), _jsx("div", { className: "border-border my-2 border-t" }), isAuthenticated ? (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/profile", onClick: () => dispatch(closeMobileMenu()), className: "text-foreground hover:text-primary text-base font-medium transition-colors", children: "Profile" }), _jsx(Link, { to: "/orders", onClick: () => dispatch(closeMobileMenu()), className: "text-foreground hover:text-primary text-base font-medium transition-colors", children: "My Orders" }), _jsx("button", { onClick: () => {
                                                    handleLogout();
                                                    dispatch(closeMobileMenu());
                                                }, className: "text-danger text-left text-base font-medium", children: "Sign out" })] })) : (_jsx(Link, { to: "/login", onClick: () => dispatch(closeMobileMenu()), className: "text-primary text-base font-semibold", children: "Sign in" }))] })] })] }))] }));
}
/* ── Inline SVG icons (no extra deps) ─── */
function SearchIcon({ className = 'h-6 w-6' }) {
    return (_jsx("svg", { className: className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" }) }));
}
function CartIcon() {
    return (_jsx("svg", { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m5-9l2 9" }) }));
}
function UserIcon({ className = 'h-6 w-6' }) {
    return (_jsx("svg", { className: className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z" }) }));
}
function OrderIcon({ className = 'h-6 w-6' }) {
    return (_jsx("svg", { className: className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }));
}
function LogoutIcon({ className = 'h-6 w-6' }) {
    return (_jsx("svg", { className: className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" }) }));
}
function MoonIcon() {
    return (_jsx("svg", { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" }) }));
}
function SunIcon() {
    return (_jsx("svg", { className: "h-5 w-5", fill: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M12 18a6 6 0 100-12 6 6 0 000 12zM12 0v2m0 20v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M0 12h2m20 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" }) }));
}
function MenuIcon() {
    return (_jsx("svg", { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 6h16M4 12h16M4 18h16" }) }));
}
function CloseIcon() {
    return (_jsx("svg", { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" }) }));
}
