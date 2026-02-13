import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store';
import { fetchMe } from './store/auth.slice';
import RootLayout from './layouts/RootLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/guards/ProtectedRoute';
import AdminRoute from './components/guards/AdminRoute';
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
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const BlogListPage = lazy(() => import('./pages/BlogListPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));

/* ── Admin pages ──────────────────────────────── */
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const AdminProductListPage = lazy(() => import('./pages/admin/ProductListPage'));
const AdminProductFormPage = lazy(() => import('./pages/admin/ProductFormPage'));
const AdminOrderListPage = lazy(() => import('./pages/admin/OrderListPage'));
const AdminOrderDetailPage = lazy(() => import('./pages/admin/OrderDetailPage'));
const InventoryPage = lazy(() => import('./pages/admin/InventoryPage'));
const SpeciesPage = lazy(() => import('./pages/admin/SpeciesPage'));
const AdminBlogListPage = lazy(() => import('./pages/admin/BlogListPage'));
const AdminBlogFormPage = lazy(() => import('./pages/admin/BlogFormPage'));

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
  );
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

  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<RootLayout />}>
            {/* Public routes */}
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductListingPage />} />
            <Route path="products/:slug" element={<ProductDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="blog" element={<BlogListPage />} />
            <Route path="blog/:slug" element={<BlogDetailPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            {/* Protected routes — require authentication */}
            <Route
              path="checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="order-success"
              element={
                <ProtectedRoute>
                  <OrderSuccessPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="orders"
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="wishlist"
              element={
                <ProtectedRoute>
                  <WishlistPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* ── Admin routes ── */}
          <Route path="admin/login" element={<AdminLoginPage />} />
          <Route
            path="admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<AdminProductListPage />} />
            <Route path="products/new" element={<AdminProductFormPage />} />
            <Route path="products/:id/edit" element={<AdminProductFormPage />} />
            <Route path="orders" element={<AdminOrderListPage />} />
            <Route path="orders/:id" element={<AdminOrderDetailPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="species" element={<SpeciesPage />} />
            <Route path="blogs" element={<AdminBlogListPage />} />
            <Route path="blogs/new" element={<AdminBlogFormPage />} />
            <Route path="blogs/:id/edit" element={<AdminBlogFormPage />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
