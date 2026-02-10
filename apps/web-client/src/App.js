import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store';
import { fetchMe } from './store/auth.slice';
import RootLayout from './layouts/RootLayout';
import ProtectedRoute from './components/guards/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
/* ── Lazy-loaded pages (code-split per route) ─── */
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductListingPage = lazy(() => import('./pages/ProductListingPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
function PageLoader() {
    return (_jsx("div", { className: "flex min-h-[60vh] items-center justify-center", children: _jsx("div", { className: "border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" }) }));
}
export default function App() {
    const dispatch = useAppDispatch();
    const { token, user } = useAppSelector((s) => s.auth);
    /* Restore session on mount — only if token exists but user isn't loaded yet */
    useEffect(() => {
        if (token && !user) {
            dispatch(fetchMe());
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return (_jsx(ErrorBoundary, { children: _jsx(Suspense, { fallback: _jsx(PageLoader, {}), children: _jsx(Routes, { children: _jsxs(Route, { element: _jsx(RootLayout, {}), children: [_jsx(Route, { index: true, element: _jsx(HomePage, {}) }), _jsx(Route, { path: "products", element: _jsx(ProductListingPage, {}) }), _jsx(Route, { path: "products/:slug", element: _jsx(ProductDetailPage, {}) }), _jsx(Route, { path: "cart", element: _jsx(CartPage, {}) }), _jsx(Route, { path: "search", element: _jsx(SearchPage, {}) }), _jsx(Route, { path: "login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "register", element: _jsx(RegisterPage, {}) }), _jsx(Route, { path: "checkout", element: _jsx(ProtectedRoute, { children: _jsx(CheckoutPage, {}) }) }), _jsx(Route, { path: "order-success", element: _jsx(ProtectedRoute, { children: _jsx(OrderSuccessPage, {}) }) }), _jsx(Route, { path: "orders", element: _jsx(ProtectedRoute, { children: _jsx(OrdersPage, {}) }) }), _jsx(Route, { path: "orders/:id", element: _jsx(ProtectedRoute, { children: _jsx(OrderDetailPage, {}) }) }), _jsx(Route, { path: "profile", element: _jsx(ProtectedRoute, { children: _jsx(ProfilePage, {}) }) }), _jsx(Route, { path: "*", element: _jsx(NotFoundPage, {}) })] }) }) }) }));
}
