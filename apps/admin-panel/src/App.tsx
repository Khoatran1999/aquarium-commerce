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
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="bg-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
  );
}

/* ── Auth Guard ───────────────────────────── */
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, user } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) return <PageLoader />;
  if (!isAuthenticated || !user) return null;
  return <>{children}</>;
}

/* ── App ──────────────────────────────────── */
export default function App() {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (token) dispatch(fetchMe());
  }, [dispatch, token]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: '10px', fontSize: '14px' },
        }}
      />
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <RequireAuth>
                  <AdminLayout />
                </RequireAuth>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="products" element={<ProductListPage />} />
              <Route path="products/new" element={<ProductFormPage />} />
              <Route path="products/:id/edit" element={<ProductFormPage />} />
              <Route path="orders" element={<OrderListPage />} />
              <Route path="orders/:id" element={<OrderDetailPage />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="species" element={<SpeciesPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
