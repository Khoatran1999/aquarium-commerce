import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store';
/**
 * Blocks non-ADMIN users. Must be nested inside ProtectedRoute
 * (or used where isAuthenticated is already guaranteed).
 */
export default function AdminRoute({ children }) {
    const { user, isAuthenticated, loading } = useAppSelector((s) => s.auth);
    if (loading) {
        return (_jsx("div", { className: "flex min-h-[60vh] items-center justify-center", children: _jsx("div", { className: "border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" }) }));
    }
    if (!isAuthenticated || user?.role !== 'ADMIN') {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
