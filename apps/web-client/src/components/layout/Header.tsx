import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  ChevronRight,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { toggleTheme, toggleMobileMenu, closeMobileMenu } from '../../store/ui.slice';
import { logout } from '../../store/auth.slice';
import { fetchWishlistIds } from '../../store/wishlist.slice';
import { useCartFly } from '../../context/CartFlyContext';

const NAV_LINKS = [
  { label: 'Shop', href: '/products' },
  { label: 'Species', href: '/products?category=species' },
  { label: 'Blog', href: '/blog' },
  { label: 'AI Advisor', href: '/ai-chat' },
];

export default function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, mobileMenuOpen } = useAppSelector((s) => s.ui);
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const { itemCount } = useAppSelector((s) => s.cart);
  const wishlistCount = useAppSelector((s) => s.wishlist.ids.length);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchWishlistIds());
  }, [isAuthenticated, dispatch]);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const [cartOpen, setCartOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const cartItems = useAppSelector((s) => s.cart.items);
  const cartSubtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const { cartIconRef } = useCartFly();

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

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node))
        setUserMenuOpen(false);
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) setCartOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    navigate('/');
  };

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href.split('?')[0]);

  return (
    <>
      {/* ── Sticky header ─── */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'border-b border-[#CCE0ED]/80 bg-white/90 shadow-sm backdrop-blur-xl dark:border-[#0D2C45]/80 dark:bg-[#000F1E]/92'
            : 'border-b border-transparent bg-white/70 backdrop-blur-lg dark:bg-[#000F1E]/80'
        }`}
      >
        {/* Top accent line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#0094C4] to-transparent opacity-60 dark:via-[#00CCEE]" />

        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-3 md:px-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0094C4] to-[#0077A3] shadow-md dark:from-[#00CCEE] dark:to-[#0094C4]">
              <svg className="h-5 w-5 text-white" viewBox="0 0 48 48" fill="none">
                <path
                  d="M42.17 20.17L27.83 5.83c1.31 1.31.57 4.36-1.63 7.94a38.3 38.3 0 0 1-5.55 6.89 38.3 38.3 0 0 1-6.89 5.55c-3.58 2.2-6.63 2.93-7.94 1.63L20.17 42.17c1.31 1.31 4.36.57 7.94-1.63a38.3 38.3 0 0 0 6.89-5.55 38.3 38.3 0 0 0 5.55-6.89c2.2-3.58 2.93-6.63 1.63-7.94z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#0A1825] dark:text-[#D6EAFF]">
              Aqua<span className="text-[#0094C4] dark:text-[#00CCEE]">Luxe</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-[#0094C4]/10 text-[#0094C4] dark:bg-[#00CCEE]/10 dark:text-[#00CCEE]'
                    : 'text-[#0A1825]/75 hover:bg-[#0094C4]/8 hover:text-[#0094C4] dark:text-[#D6EAFF]/70 dark:hover:bg-[#00CCEE]/8 dark:hover:text-[#00CCEE]'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-[#0094C4] dark:bg-[#00CCEE]"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search (desktop) */}
            <label className="hidden h-9 w-56 cursor-text items-center gap-2 rounded-full border border-[#CCE0ED] bg-[#F2F8FC] px-3.5 transition-all duration-200 focus-within:border-[#0094C4] focus-within:shadow-[0_0_0_3px_rgba(0,148,196,0.12)] lg:flex dark:border-[#0D2C45] dark:bg-[#071F36] dark:focus-within:border-[#00CCEE] dark:focus-within:shadow-[0_0_0_3px_rgba(0,204,238,0.12)]">
              <Search className="h-4 w-4 shrink-0 text-[#547698] dark:text-[#6496B8]" />
              <input
                className="w-full border-none bg-transparent text-sm text-[#0A1825] placeholder-[#547698] focus:outline-none focus:ring-0 dark:text-[#D6EAFF] dark:placeholder-[#6496B8]"
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
              className="rounded-full p-2 text-[#547698] transition-all duration-200 hover:bg-[#0094C4]/10 hover:text-[#0094C4] dark:text-[#6496B8] dark:hover:bg-[#00CCEE]/10 dark:hover:text-[#00CCEE]"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex"
                >
                  {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </motion.span>
              </AnimatePresence>
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative rounded-full p-2 text-[#547698] transition-all duration-200 hover:bg-[#FF5252]/10 hover:text-[#FF5252] dark:text-[#6496B8] dark:hover:bg-[#FF6B6B]/10 dark:hover:text-[#FF6B6B]"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-[#FF5252] px-1 text-[9px] font-bold text-white dark:bg-[#FF6B6B]">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart + mini dropdown */}
            <div className="relative" ref={cartRef}>
              <button
                ref={cartIconRef}
                onClick={() => setCartOpen((p) => !p)}
                className="relative rounded-full p-2 text-[#547698] transition-all duration-200 hover:bg-[#0094C4]/10 hover:text-[#0094C4] dark:text-[#6496B8] dark:hover:bg-[#00CCEE]/10 dark:hover:text-[#00CCEE]"
                aria-label="Cart"
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-[#0094C4] px-1 text-[9px] font-bold text-white dark:bg-[#00CCEE] dark:text-[#000F1E]"
                    animate={cartBounce ? { scale: [1, 1.45, 1] } : {}}
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
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-[#CCE0ED] bg-white shadow-xl dark:border-[#0D2C45] dark:bg-[#041628]"
                  >
                    {/* Cart header */}
                    <div className="border-b border-[#CCE0ED] px-4 py-3 dark:border-[#0D2C45]">
                      <p className="text-sm font-semibold text-[#0A1825] dark:text-[#D6EAFF]">
                        Cart{' '}
                        <span className="ml-1 rounded-full bg-[#E4EFF8] px-2 py-0.5 text-xs font-bold text-[#0094C4] dark:bg-[#071F36] dark:text-[#00CCEE]">
                          {itemCount}
                        </span>
                      </p>
                    </div>

                    {cartItems.length === 0 ? (
                      <div className="flex flex-col items-center gap-2 py-8">
                        <ShoppingCart size={32} className="text-[#CCE0ED] dark:text-[#0D2C45]" />
                        <p className="text-sm text-[#547698] dark:text-[#6496B8]">
                          Your cart is empty
                        </p>
                        <Link
                          to="/products"
                          onClick={() => setCartOpen(false)}
                          className="mt-1 text-sm font-semibold text-[#0094C4] hover:underline dark:text-[#00CCEE]"
                        >
                          Browse Products
                        </Link>
                      </div>
                    ) : (
                      <>
                        <div className="flex max-h-56 flex-col gap-0 overflow-y-auto">
                          {cartItems.slice(0, 3).map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 border-b border-[#F2F8FC] px-4 py-3 last:border-0 dark:border-[#071F36]"
                            >
                              <img
                                src={item.product?.images?.[0]?.url ?? '/placeholder-fish.jpg'}
                                alt={item.product?.name ?? ''}
                                className="h-11 w-11 shrink-0 rounded-xl object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="line-clamp-1 text-xs font-semibold text-[#0A1825] dark:text-[#D6EAFF]">
                                  {item.product?.name}
                                </p>
                                <p className="text-xs text-[#547698] dark:text-[#6496B8]">
                                  {item.quantity} × ${item.price.toFixed(2)}
                                </p>
                              </div>
                              <span className="shrink-0 text-sm font-bold text-[#0094C4] dark:text-[#00CCEE]">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                          {cartItems.length > 3 && (
                            <p className="px-4 py-2 text-center text-xs text-[#547698] dark:text-[#6496B8]">
                              +{cartItems.length - 3} more item{cartItems.length - 3 !== 1 ? 's' : ''}
                            </p>
                          )}
                        </div>

                        <div className="border-t border-[#CCE0ED] p-4 dark:border-[#0D2C45]">
                          <div className="mb-3 flex items-center justify-between">
                            <span className="text-sm text-[#547698] dark:text-[#6496B8]">
                              Subtotal
                            </span>
                            <span className="text-base font-bold text-[#0A1825] dark:text-[#D6EAFF]">
                              ${cartSubtotal.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Link
                              to="/cart"
                              onClick={() => setCartOpen(false)}
                              className="flex-1 rounded-xl border border-[#CCE0ED] py-2 text-center text-xs font-semibold text-[#0A1825] transition-colors hover:bg-[#E4EFF8] dark:border-[#0D2C45] dark:text-[#D6EAFF] dark:hover:bg-[#071F36]"
                            >
                              View Cart
                            </Link>
                            <Link
                              to="/checkout"
                              onClick={() => setCartOpen(false)}
                              className="flex-1 rounded-xl bg-gradient-to-r from-[#0094C4] to-[#0077A3] py-2 text-center text-xs font-semibold text-white shadow-md transition-opacity hover:opacity-90 dark:from-[#00CCEE] dark:to-[#0094C4] dark:text-[#000F1E]"
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

            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((p) => !p)}
                  className="flex items-center gap-2 rounded-full p-1 transition-all duration-200 hover:ring-2 hover:ring-[#0094C4]/30 dark:hover:ring-[#00CCEE]/30"
                  aria-label="User menu"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-[#CCE0ED] dark:ring-[#0D2C45]"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#0094C4] to-[#0077A3] text-xs font-bold text-white dark:from-[#00CCEE] dark:to-[#0094C4] dark:text-[#000F1E]">
                      {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.16 }}
                      className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-[#CCE0ED] bg-white shadow-xl dark:border-[#0D2C45] dark:bg-[#041628]"
                    >
                      <div className="border-b border-[#CCE0ED] px-4 py-3 dark:border-[#0D2C45]">
                        <p className="truncate text-sm font-semibold text-[#0A1825] dark:text-[#D6EAFF]">
                          {user?.name}
                        </p>
                        <p className="truncate text-xs text-[#547698] dark:text-[#6496B8]">
                          {user?.email}
                        </p>
                      </div>

                      {[
                        { to: '/profile', icon: User, label: 'Profile' },
                        { to: '/orders', icon: ClipboardList, label: 'My Orders' },
                      ].map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#0A1825] transition-colors hover:bg-[#F2F8FC] dark:text-[#D6EAFF] dark:hover:bg-[#071F36]"
                        >
                          <item.icon size={15} className="text-[#547698] dark:text-[#6496B8]" />
                          {item.label}
                        </Link>
                      ))}

                      <div className="mx-4 my-1 border-t border-[#CCE0ED] dark:border-[#0D2C45]" />

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[#ef4444] transition-colors hover:bg-red-50 dark:hover:bg-red-900/10"
                      >
                        <LogOut size={15} />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden rounded-xl border border-[#CCE0ED] bg-white px-4 py-2 text-sm font-semibold text-[#0A1825] shadow-sm transition-all hover:border-[#0094C4] hover:text-[#0094C4] dark:border-[#0D2C45] dark:bg-[#071F36] dark:text-[#D6EAFF] dark:hover:border-[#00CCEE] dark:hover:text-[#00CCEE] sm:flex"
              >
                Sign in
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="rounded-full p-2 text-[#547698] transition-colors hover:bg-[#E4EFF8] dark:text-[#6496B8] dark:hover:bg-[#071F36] md:hidden"
              onClick={() => dispatch(toggleMobileMenu())}
              aria-label="Menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu ─── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[60] md:hidden">
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => dispatch(closeMobileMenu())}
            />
            <motion.nav
              className="absolute right-0 top-0 h-full w-72 overflow-y-auto border-l border-[#CCE0ED] bg-white shadow-2xl dark:border-[#0D2C45] dark:bg-[#041628]"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            >
              {/* Mobile menu header */}
              <div className="flex items-center justify-between border-b border-[#CCE0ED] px-5 py-4 dark:border-[#0D2C45]">
                <Link
                  to="/"
                  onClick={() => dispatch(closeMobileMenu())}
                  className="flex items-center gap-2"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#0094C4] to-[#0077A3] dark:from-[#00CCEE] dark:to-[#0094C4]">
                    <svg className="h-4 w-4 text-white" viewBox="0 0 48 48" fill="none">
                      <path
                        d="M42.17 20.17L27.83 5.83c1.31 1.31.57 4.36-1.63 7.94a38.3 38.3 0 0 1-5.55 6.89 38.3 38.3 0 0 1-6.89 5.55c-3.58 2.2-6.63 2.93-7.94 1.63L20.17 42.17c1.31 1.31 4.36.57 7.94-1.63a38.3 38.3 0 0 0 6.89-5.55 38.3 38.3 0 0 0 5.55-6.89c2.2-3.58 2.93-6.63 1.63-7.94z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <span className="font-bold text-[#0A1825] dark:text-[#D6EAFF]">
                    Aqua<span className="text-[#0094C4] dark:text-[#00CCEE]">Luxe</span>
                  </span>
                </Link>
                <button
                  onClick={() => dispatch(closeMobileMenu())}
                  className="rounded-full p-2 text-[#547698] hover:bg-[#E4EFF8] dark:text-[#6496B8] dark:hover:bg-[#071F36]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Nav links */}
              <div className="p-5">
                <div className="flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => dispatch(closeMobileMenu())}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        isActive(link.href)
                          ? 'bg-[#0094C4]/10 text-[#0094C4] dark:bg-[#00CCEE]/10 dark:text-[#00CCEE]'
                          : 'text-[#0A1825] hover:bg-[#F2F8FC] dark:text-[#D6EAFF] dark:hover:bg-[#071F36]'
                      }`}
                    >
                      {link.label}
                      <ChevronRight size={14} className="opacity-40" />
                    </Link>
                  ))}
                </div>

                <div className="my-4 border-t border-[#CCE0ED] dark:border-[#0D2C45]" />

                {isAuthenticated ? (
                  <div className="flex flex-col gap-1">
                    {[
                      { to: '/profile', label: 'Profile' },
                      { to: '/orders', label: 'My Orders' },
                      { to: '/wishlist', label: `Wishlist${wishlistCount > 0 ? ` (${wishlistCount})` : ''}` },
                    ].map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => dispatch(closeMobileMenu())}
                        className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-[#0A1825] transition-colors hover:bg-[#F2F8FC] dark:text-[#D6EAFF] dark:hover:bg-[#071F36]"
                      >
                        {item.label}
                        <ChevronRight size={14} className="opacity-40" />
                      </Link>
                    ))}
                    <button
                      onClick={() => {
                        handleLogout();
                        dispatch(closeMobileMenu());
                      }}
                      className="mt-2 flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium text-[#ef4444] transition-colors hover:bg-red-50 dark:hover:bg-red-900/10"
                    >
                      <LogOut size={15} className="mr-3" />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => dispatch(closeMobileMenu())}
                    className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#0094C4] to-[#0077A3] py-3 text-sm font-semibold text-white shadow-md dark:from-[#00CCEE] dark:to-[#0094C4] dark:text-[#000F1E]"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
