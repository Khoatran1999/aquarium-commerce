import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store';
/**
 * Redirects unauthenticated users to /login,
 * preserving the originally requested URL as `state.from`.
 */
export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAppSelector((s) => s.auth);
    const location = useLocation();
    /* Still hydrating — avoid flash of redirect */
    if (loading) {
        return (_jsx("div", { className: "flex min-h-[60vh] items-center justify-center", children: _jsx("div", { className: "border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" }) }));
    }
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", state: { from: location.pathname }, replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
