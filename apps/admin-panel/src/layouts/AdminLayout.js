import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Fish, ShoppingCart, Package, Layers, ChevronLeft, Sun, Moon, Bell, LogOut, User, Menu, X, } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleTheme, toggleSidebar } from '../store/ui.slice';
import { logout } from '../store/auth.slice';
const NAV_ITEMS = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Products', href: '/products', icon: Package },
    { label: 'Orders', href: '/orders', icon: ShoppingCart },
    { label: 'Inventory', href: '/inventory', icon: Layers },
    { label: 'Species', href: '/species', icon: Fish },
];
function Breadcrumb() {
    const { pathname } = useLocation();
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0)
        return _jsx("span", { className: "text-foreground text-sm font-medium", children: "Dashboard" });
    return (_jsxs("div", { className: "flex items-center gap-1 text-sm", children: [_jsx(NavLink, { to: "/", className: "text-muted-foreground hover:text-foreground transition-colors", children: "Dashboard" }), segments.map((seg, i) => (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx("span", { className: "text-muted-foreground", children: "/" }), i === segments.length - 1 ? (_jsx("span", { className: "text-foreground font-medium capitalize", children: seg.replace(/-/g, ' ') })) : (_jsx(NavLink, { to: '/' + segments.slice(0, i + 1).join('/'), className: "text-muted-foreground hover:text-foreground capitalize transition-colors", children: seg.replace(/-/g, ' ') }))] }, seg)))] }));
}
export default function AdminLayout() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { theme, sidebarCollapsed } = useAppSelector((s) => s.ui);
    const { user } = useAppSelector((s) => s.auth);
    const [userOpen, setUserOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const userRef = useRef(null);
    useEffect(() => {
        function handleClick(e) {
            if (userRef.current && !userRef.current.contains(e.target)) {
                setUserOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };
    const sidebarContent = (_jsx("nav", { className: "flex-1 space-y-1 p-2", children: NAV_ITEMS.map((item) => (_jsxs(NavLink, { to: item.href, end: item.href === '/', onClick: () => setMobileOpen(false), className: ({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`, children: [_jsx(item.icon, { className: "h-5 w-5 shrink-0" }), !sidebarCollapsed && _jsx("span", { children: item.label })] }, item.href))) }));
    return (_jsxs("div", { className: "bg-background flex min-h-screen", children: [_jsxs("aside", { className: `bg-sidebar border-border hidden flex-col border-r transition-all duration-200 md:flex ${sidebarCollapsed ? 'w-16' : 'w-60'}`, children: [_jsxs("div", { className: "border-border flex h-14 items-center gap-2 border-b px-4", children: [_jsx("div", { className: "bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white", children: "A" }), !sidebarCollapsed && (_jsx("span", { className: "text-foreground text-sm font-bold tracking-tight", children: "AquaAdmin" }))] }), sidebarContent, _jsx("button", { onClick: () => dispatch(toggleSidebar()), className: "text-muted-foreground hover:bg-muted m-2 flex items-center justify-center rounded-lg p-2", children: _jsx(ChevronLeft, { className: `h-5 w-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}` }) })] }), _jsx(AnimatePresence, { children: mobileOpen && (_jsxs(_Fragment, { children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 0.4 }, exit: { opacity: 0 }, className: "fixed inset-0 z-40 bg-black md:hidden", onClick: () => setMobileOpen(false) }), _jsxs(motion.aside, { initial: { x: -260 }, animate: { x: 0 }, exit: { x: -260 }, transition: { type: 'spring', damping: 25, stiffness: 300 }, className: "bg-sidebar fixed inset-y-0 left-0 z-50 flex w-60 flex-col md:hidden", children: [_jsxs("div", { className: "border-border flex h-14 items-center justify-between border-b px-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "bg-primary flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white", children: "A" }), _jsx("span", { className: "text-foreground text-sm font-bold", children: "AquaAdmin" })] }), _jsx("button", { onClick: () => setMobileOpen(false), className: "text-muted-foreground", children: _jsx(X, { className: "h-5 w-5" }) })] }), sidebarContent] })] })) }), _jsxs("div", { className: "flex flex-1 flex-col overflow-hidden", children: [_jsxs("header", { className: "bg-card border-border flex h-14 items-center justify-between border-b px-4 md:px-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: () => setMobileOpen(true), className: "text-muted-foreground hover:bg-muted rounded-lg p-1.5 md:hidden", children: _jsx(Menu, { className: "h-5 w-5" }) }), _jsx(Breadcrumb, {})] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => dispatch(toggleTheme()), className: "text-muted-foreground hover:bg-muted rounded-lg p-2 transition-colors", children: theme === 'dark' ? _jsx(Sun, { className: "h-4 w-4" }) : _jsx(Moon, { className: "h-4 w-4" }) }), _jsx("button", { className: "text-muted-foreground hover:bg-muted relative rounded-lg p-2 transition-colors", children: _jsx(Bell, { className: "h-4 w-4" }) }), _jsxs("div", { className: "relative", ref: userRef, children: [_jsxs("button", { onClick: () => setUserOpen(!userOpen), className: "hover:bg-muted flex items-center gap-2 rounded-lg p-1.5 transition-colors", children: [_jsx("div", { className: "bg-primary/20 text-primary flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold", children: user?.name?.[0]?.toUpperCase() ?? 'A' }), user && (_jsx("span", { className: "text-foreground hidden text-xs font-medium md:block", children: user.name }))] }), _jsx(AnimatePresence, { children: userOpen && (_jsxs(motion.div, { initial: { opacity: 0, y: 4, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 4, scale: 0.95 }, transition: { duration: 0.12 }, className: "bg-card border-border shadow-elevated absolute right-0 top-full mt-1 w-48 rounded-lg border py-1", children: [_jsxs("div", { className: "border-border border-b px-3 py-2", children: [_jsx("p", { className: "text-foreground text-sm font-medium", children: user?.name }), _jsx("p", { className: "text-muted-foreground text-xs", children: user?.email })] }), _jsxs("button", { onClick: () => {
                                                                setUserOpen(false);
                                                                navigate('/');
                                                            }, className: "text-muted-foreground hover:bg-muted hover:text-foreground flex w-full items-center gap-2 px-3 py-2 text-sm", children: [_jsx(User, { className: "h-4 w-4" }), "Profile"] }), _jsxs("button", { onClick: handleLogout, className: "text-danger hover:bg-danger/10 flex w-full items-center gap-2 px-3 py-2 text-sm", children: [_jsx(LogOut, { className: "h-4 w-4" }), "Sign Out"] })] })) })] })] })] }), _jsx("main", { className: "bg-background flex-1 overflow-auto", children: _jsx(Outlet, {}) })] })] }));
}
