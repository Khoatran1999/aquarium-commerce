import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { logout } from '../../store/auth.slice';

/**
 * Blocks non-ADMIN users. Redirects to /admin/login if not authenticated,
 * or logs out a non-admin user first then redirects to /admin/login.
 */
export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading, token } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const location = useLocation();

  // If a non-admin user is logged in, log them out so they can access admin login
  useEffect(() => {
    if (isAuthenticated && user && user.role !== 'ADMIN') {
      dispatch(logout());
    }
  }, [isAuthenticated, user, dispatch]);

  // Still loading OR have a token but user not fetched yet — show spinner
  if (loading || (token && !user)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'ADMIN') {
    // Will be caught by useEffect above on next render
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
