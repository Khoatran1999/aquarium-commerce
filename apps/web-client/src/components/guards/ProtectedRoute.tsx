import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store';

/**
 * Redirects unauthenticated users to /login,
 * preserving the originally requested URL as `state.from`.
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAppSelector((s) => s.auth);
  const location = useLocation();

  /* Still hydrating — avoid flash of redirect */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
