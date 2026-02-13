import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  User,
  ClipboardList,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Heart,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { toggleTheme, toggleMobileMenu, closeMobileMenu } from '../../store/ui.slice';
import { logout } from '../../store/auth.slice';
import { fetchWishlistIds } from '../../store/wishlist.slice';

const NAV_LINKS = [
  { label: 'Shop', href: '/products' },
  { label: 'Species', href: '/products?category=species' },
  { label: 'Blog', href: '/blog' },
  { label: 'AI Advisor', href: '/ai-chat' },
];

export default function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { theme, mobileMenuOpen } = useAppSelector((s) => s.ui);
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const { itemCount } = useAppSelector((s) => s.cart);
  const wishlistCount = useAppSelector((s) => s.wishlist.ids.length);

  /* Sync wishlist IDs on auth change */
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlistIds());
    }
  }, [isAuthenticated, dispatch]);

  /* User dropdown state */
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  /* Mini cart dropdown */
  const [cartOpen, setCartOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const cartItems = useAppSelector((s) => s.cart.items);
  const cartSubtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  /* Track itemCount changes for bounce animation */
  const [cartBounce, setCartBounce] = useState(false);
  const prevItemCount = useRef(itemCount);
  useEffect(() => {
    if (itemCount > prevItemCount.current) {
      setCartBounce(true);
      const t = setTimeout(() => setCartBounce(false), 400);
      return () => clearTimeout(t);
    }
    prevItemCount.current = itemCount;
  }, [itemCount]);

  /* Close dropdowns on outside click */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setCartOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* ── Sticky header ─── */}
      <header className="border-primary/20 dark:border-border sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md dark:bg-[#0c2a35]/90">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-3 md:px-10">
          {/* Logo */}
          <Link to="/" className="text-primary flex items-center gap-2">
            <svg
              className="h-8 w-8"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M42.17 20.17L27.83 5.83c1.31 1.31.57 4.36-1.63 7.94a38.3 38.3 0 0 1-5.55 6.89 38.3 38.3 0 0 1-6.89 5.55c-3.58 2.2-6.63 2.93-7.94 1.63L20.17 42.17c1.31 1.31 4.36.57 7.94-1.63a38.3 38.3 0 0 0 6.89-5.55 38.3 38.3 0 0 0 5.55-6.89c2.2-3.58 2.93-6.63 1.63-7.94z"
                fill="currentColor"
              />
            </svg>
            <span className="text-foreground text-xl font-bold tracking-tight">AquaLuxe</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-foreground hover:text-secondary text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search (desktop) */}
            <label className="bg-muted focus-within:border-primary hidden h-10 w-64 items-center rounded-full border border-transparent px-4 transition-all lg:flex">
              <Search className="text-muted-foreground h-5 w-5" size={20} />
              <input
                className="placeholder-muted-foreground ml-2 w-full border-none bg-transparent text-sm focus:outline-none focus:ring-0"
                placeholder="Search fish species..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const v = (e.target as HTMLInputElement).value.trim();
                    if (v) navigate(`/search?q=${encodeURIComponent(v)}`);
                  }
                }}
              />
            </label>

            {/* Theme toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="hover:bg-primary/10 rounded-full p-2 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Wishlist icon with badge */}
            <Link
              to="/wishlist"
              className="hover:bg-primary/10 relative rounded-full p-2 transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={24} />
              {wishlistCount > 0 && (
                <span className="bg-danger absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart with badge + mini cart dropdown */}
            <div className="relative" ref={cartRef}>
              <button
                onClick={() => setCartOpen((p) => !p)}
                className="hover:bg-primary/10 relative rounded-full p-2 transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart size={24} />
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    className="bg-secondary absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
                    animate={cartBounce ? { scale: [1, 1.4, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </motion.span>
                )}
              </button>

              {/* Mini cart dropdown */}
              <AnimatePresence>
                {cartOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="bg-card border-border shadow-elevated absolute right-0 top-full mt-2 w-80 rounded-xl border p-4"
                  >
                    {cartItems.length === 0 ? (
                      <div className="py-6 text-center">
                        <p className="text-muted-foreground text-sm">Your cart is empty</p>
                        <Link
                          to="/products"
                          onClick={() => setCartOpen(false)}
                          className="text-primary mt-2 inline-block text-sm font-medium hover:underline"
                        >
                          Browse Products
                        </Link>
                      </div>
                    ) : (
                      <>
                        <p className="text-foreground mb-3 text-sm font-semibold">
                          Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                        </p>
                        <div className="flex max-h-60 flex-col gap-3 overflow-y-auto">
                          {cartItems.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                              <img
                                src={item.product?.images?.[0]?.url ?? '/placeholder-fish.jpg'}
                                alt={item.product?.name ?? ''}
                                className="h-11 w-11 rounded-lg object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-foreground line-clamp-1 text-xs font-medium">
                                  {item.product?.name}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  {item.quantity} × ${item.price.toFixed(2)}
                                </p>
                              </div>
                              <span className="text-foreground text-xs font-semibold">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                          {cartItems.length > 3 && (
                            <p className="text-muted-foreground text-center text-xs">
                              +{cartItems.length - 3} more{' '}
                              {cartItems.length - 3 === 1 ? 'item' : 'items'}
                            </p>
                          )}
                        </div>
                        <div className="border-border mt-3 border-t pt-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="text-foreground font-semibold">
                              ${cartSubtotal.toFixed(2)}
                            </span>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <Link
                              to="/cart"
                              onClick={() => setCartOpen(false)}
                              className="border-border text-foreground hover:bg-muted flex-1 rounded-lg border py-2 text-center text-xs font-medium transition-colors"
                            >
                              View Cart
                            </Link>
                            <Link
                              to="/checkout"
                              onClick={() => setCartOpen(false)}
                              className="bg-primary flex-1 rounded-lg py-2 text-center text-xs font-medium text-white transition-colors hover:opacity-90"
                            >
                              Checkout
                            </Link>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User — auth-aware */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((p) => !p)}
                  className="hover:bg-primary/10 flex items-center gap-2 rounded-full p-1.5 transition-colors"
                  aria-label="User menu"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <span className="bg-primary flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                    </span>
                  )}
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="bg-card border-border shadow-elevated absolute right-0 top-full mt-2 w-56 rounded-xl border py-2">
                    <div className="border-border border-b px-4 py-2.5">
                      <p className="text-foreground truncate text-sm font-semibold">{user?.name}</p>
                      <p className="text-muted-foreground truncate text-xs">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="text-foreground hover:bg-muted flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                    >
                      <User className="h-4 w-4" size={16} /> Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="text-foreground hover:bg-muted flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                    >
                      <ClipboardList className="h-4 w-4" size={16} /> My Orders
                    </Link>
                    <div className="border-border my-1 border-t" />
                    <button
                      onClick={handleLogout}
                      className="text-danger hover:bg-danger/5 flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                    >
                      <LogOut className="h-4 w-4" size={16} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hover:bg-primary/10 rounded-full p-2 transition-colors"
                aria-label="Sign in"
              >
                <User size={24} />
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="hover:bg-primary/10 rounded-full p-2 transition-colors md:hidden"
              onClick={() => dispatch(toggleMobileMenu())}
              aria-label="Menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu overlay ─── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => dispatch(closeMobileMenu())}
          />
          <nav className="bg-card shadow-elevated absolute right-0 top-0 h-full w-72 p-6">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-foreground text-lg font-bold">Menu</span>
              <button onClick={() => dispatch(closeMobileMenu())}>
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => dispatch(closeMobileMenu())}
                  className="text-foreground hover:text-primary text-base font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-border my-2 border-t" />
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => dispatch(closeMobileMenu())}
                    className="text-foreground hover:text-primary text-base font-medium transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => dispatch(closeMobileMenu())}
                    className="text-foreground hover:text-primary text-base font-medium transition-colors"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => dispatch(closeMobileMenu())}
                    className="text-foreground hover:text-primary text-base font-medium transition-colors"
                  >
                    Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      dispatch(closeMobileMenu());
                    }}
                    className="text-danger text-left text-base font-medium"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => dispatch(closeMobileMenu())}
                  className="text-primary text-base font-semibold"
                >
                  Sign in
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
