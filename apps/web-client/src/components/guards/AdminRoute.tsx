import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store';

/**
 * Blocks non-ADMIN users. Must be nested inside ProtectedRoute
 * (or used where isAuthenticated is already guaranteed).
 */
export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAppSelector((s) => s.auth);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
