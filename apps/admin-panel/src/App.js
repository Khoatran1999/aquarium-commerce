import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAppSelector, useAppDispatch } from './store';
import { fetchMe } from './store/auth.slice';
import AdminLayout from './layouts/AdminLayout';
import ErrorBoundary from './components/ErrorBoundary';
/* ── Lazy Pages ───────────────────────────── */
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProductListPage = lazy(() => import('./pages/ProductListPage'));
const ProductFormPage = lazy(() => import('./pages/ProductFormPage'));
const OrderListPage = lazy(() => import('./pages/OrderListPage'));
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage'));
const InventoryPage = lazy(() => import('./pages/InventoryPage'));
const SpeciesPage = lazy(() => import('./pages/SpeciesPage'));
/* ── Page Loader ──────────────────────────── */
function PageLoader() {
    return (_jsx("div", { className: "flex h-[60vh] items-center justify-center", children: _jsx("div", { className: "bg-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" }) }));
}
/* ── Auth Guard ───────────────────────────── */
function RequireAuth({ children }) {
    const { isAuthenticated, loading, user } = useAppSelector((s) => s.auth);
    const navigate = useNavigate();
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, loading, navigate]);
    if (loading)
        return _jsx(PageLoader, {});
    if (!isAuthenticated || !user)
        return null;
    return _jsx(_Fragment, { children: children });
}
/* ── App ──────────────────────────────────── */
export default function App() {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((s) => s.auth);
    useEffect(() => {
        if (token)
            dispatch(fetchMe());
    }, [dispatch, token]);
    return (_jsxs(_Fragment, { children: [_jsx(Toaster, { position: "top-right", toastOptions: {
                    duration: 3000,
                    style: { borderRadius: '10px', fontSize: '14px' },
                } }), _jsx(ErrorBoundary, { children: _jsx(Suspense, { fallback: _jsx(PageLoader, {}), children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsxs(Route, { element: _jsx(RequireAuth, { children: _jsx(AdminLayout, {}) }), children: [_jsx(Route, { index: true, element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "products", element: _jsx(ProductListPage, {}) }), _jsx(Route, { path: "products/new", element: _jsx(ProductFormPage, {}) }), _jsx(Route, { path: "products/:id/edit", element: _jsx(ProductFormPage, {}) }), _jsx(Route, { path: "orders", element: _jsx(OrderListPage, {}) }), _jsx(Route, { path: "orders/:id", element: _jsx(OrderDetailPage, {}) }), _jsx(Route, { path: "inventory", element: _jsx(InventoryPage, {}) }), _jsx(Route, { path: "species", element: _jsx(SpeciesPage, {}) })] }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }) })] }));
}
