import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store';

/**
 * Blocks non-ADMIN users. Redirects to /admin/login if not authenticated,
 * or to / if authenticated but not an admin.
 */
export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading, token } = useAppSelector((s) => s.auth);
  const location = useLocation();

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
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
