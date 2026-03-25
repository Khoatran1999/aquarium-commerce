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
import LogoIcon from '../LogoIcon';
import { useAppDispatch, useAppSelector } from '../../store';
import { toggleTheme, toggleMobileMenu, closeMobileMenu } from '../../store/ui.slice';
import { logout } from '../../store/auth.slice';
import { fetchWishlistIds } from '../../store/wishlist.slice';
import { useCartFly } from '../../context/CartFlyContext';

const NAV_LINKS = [
  { label: 'Shop', href: '/products' },
  { label: 'Species', href: '/products?category=species' },
  { label: 'Blog', href: '/blog' },
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
    const onScroll = () => {
      const isScrolled = window.scrollY > 12;
      setScrolled((prev) => (prev === isScrolled ? prev : isScrolled));
    };
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
            ? 'border-b border-border/80 bg-background/90 shadow-sm backdrop-blur-xl dark:bg-background/92'
            : 'border-b border-transparent bg-background/70 backdrop-blur-lg'
        }`}
      >
        {/* Top accent line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-3 md:px-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark shadow-md">
              <LogoIcon />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Aqua<span className="text-primary">Luxe</span>
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
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/75 hover:bg-primary/8 hover:text-primary'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search (desktop) */}
            <label className="hidden h-9 w-56 cursor-text items-center gap-2 rounded-full border border-border bg-background px-3.5 transition-all duration-200 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(0,148,196,0.12)] lg:flex dark:focus-within:shadow-[0_0_0_3px_rgba(0,204,238,0.12)]">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                type="search"
                name="q"
                autoComplete="off"
                spellCheck={false}
                className="w-full border-none bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-0"
                placeholder="Search fish species…"
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
              className="cursor-pointer rounded-full p-2 text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary"
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
              className="relative cursor-pointer rounded-full p-2 text-muted-foreground transition-all duration-200 hover:bg-secondary/10 hover:text-secondary"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-secondary px-1 text-xs font-bold text-white">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart + mini dropdown */}
            <div className="relative" ref={cartRef}>
              <button
                ref={cartIconRef}
                onClick={() => setCartOpen((p) => !p)}
                className="relative cursor-pointer rounded-full p-2 text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary"
                aria-label="Cart"
                aria-expanded={cartOpen}
                aria-haspopup="true"
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-white dark:text-background"
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
                    role="dialog"
                    aria-modal="true"
                    aria-label="Cart preview"
                    className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-card shadow-elevated"
                  >
                    {/* Cart header */}
                    <div className="border-b border-border px-4 py-3">
                      <p className="text-sm font-semibold text-card-foreground">
                        Cart{' '}
                        <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-bold text-primary">
                          {itemCount}
                        </span>
                      </p>
                    </div>

                    {cartItems.length === 0 ? (
                      <div className="flex flex-col items-center gap-2 py-8">
                        <ShoppingCart size={32} className="text-border" />
                        <p className="text-sm text-muted-foreground">Your cart is empty</p>
                        <Link
                          to="/products"
                          onClick={() => setCartOpen(false)}
                          className="mt-1 text-sm font-semibold text-primary hover:underline"
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
                              className="flex items-center gap-3 border-b border-background px-4 py-3 last:border-0 dark:border-muted"
                            >
                              <img
                                src={item.product?.images?.[0]?.url ?? '/placeholder-fish.jpg'}
                                alt={item.product?.name ?? ''}
                                width={44}
                                height={44}
                                className="h-11 w-11 shrink-0 rounded-xl object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="line-clamp-1 text-xs font-semibold text-card-foreground">
                                  {item.product?.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {item.quantity} × ${item.price.toFixed(2)}
                                </p>
                              </div>
                              <span className="shrink-0 text-sm font-bold text-primary">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                          {cartItems.length > 3 && (
                            <p className="px-4 py-2 text-center text-xs text-muted-foreground">
                              +{cartItems.length - 3} more item{cartItems.length - 3 !== 1 ? 's' : ''}
                            </p>
                          )}
                        </div>

                        <div className="border-t border-border p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Subtotal</span>
                            <span className="text-base font-bold text-foreground">
                              ${cartSubtotal.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Link
                              to="/cart"
                              onClick={() => setCartOpen(false)}
                              className="flex-1 cursor-pointer rounded-xl border border-border py-2 text-center text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                            >
                              View Cart
                            </Link>
                            <Link
                              to="/checkout"
                              onClick={() => setCartOpen(false)}
                              className="flex-1 cursor-pointer rounded-xl bg-gradient-to-r from-primary to-primary-dark py-2 text-center text-xs font-semibold text-white shadow-md transition-opacity hover:opacity-90 dark:text-background"
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
                  className="flex cursor-pointer items-center gap-2 rounded-full p-1 transition-all duration-200 hover:ring-2 hover:ring-primary/30"
                  aria-label="User menu"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-border"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-xs font-bold text-white dark:text-background">
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
                      className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-elevated"
                    >
                      <div className="border-b border-border px-4 py-3">
                        <p className="truncate text-sm font-semibold text-card-foreground">
                          {user?.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                      </div>

                      {[
                        { to: '/profile', icon: User, label: 'Profile' },
                        { to: '/orders', icon: ClipboardList, label: 'My Orders' },
                      ].map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-background dark:hover:bg-muted"
                        >
                          <item.icon size={15} className="text-muted-foreground" />
                          {item.label}
                        </Link>
                      ))}

                      <div className="mx-4 my-1 border-t border-border" />

                      <button
                        onClick={handleLogout}
                        className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-danger transition-colors hover:bg-red-50 dark:hover:bg-red-900/10"
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
                className="flex cursor-pointer rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-primary hover:text-primary"
              >
                Sign in
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="cursor-pointer rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted md:hidden"
              onClick={() => dispatch(toggleMobileMenu())}
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
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
              id="mobile-nav"
              aria-label="Mobile navigation"
              className="absolute right-0 top-0 h-full w-72 overflow-y-auto border-l border-border bg-card shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            >
              {/* Mobile menu header */}
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <Link
                  to="/"
                  onClick={() => dispatch(closeMobileMenu())}
                  className="flex items-center gap-2"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark">
                    <LogoIcon className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-bold text-foreground">
                    Aqua<span className="text-primary">Luxe</span>
                  </span>
                </Link>
                <button
                  onClick={() => dispatch(closeMobileMenu())}
                  className="cursor-pointer rounded-full p-2 text-muted-foreground hover:bg-muted"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile search */}
              <div className="px-5 pt-4">
                <label className="flex h-10 cursor-text items-center gap-2 rounded-xl border border-border bg-background px-3.5 transition-all duration-200 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(0,148,196,0.12)]">
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <input
                    type="search"
                    name="q"
                    autoComplete="off"
                    spellCheck={false}
                    className="w-full border-none bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-0"
                    placeholder="Search fish species…"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const v = (e.target as HTMLInputElement).value.trim();
                        if (v) {
                          navigate(`/search?q=${encodeURIComponent(v)}`);
                          dispatch(closeMobileMenu());
                        }
                      }
                    }}
                  />
                </label>
              </div>

              {/* Nav links */}
              <div className="p-5">
                <div className="flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => dispatch(closeMobileMenu())}
                      className={`flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        isActive(link.href)
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-background dark:hover:bg-muted'
                      }`}
                    >
                      {link.label}
                      <ChevronRight size={14} className="opacity-40" />
                    </Link>
                  ))}
                </div>

                <div className="my-4 border-t border-border" />

                {/* Theme toggle (mobile) */}
                <button
                  onClick={() => dispatch(toggleTheme())}
                  className="mb-4 flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-background dark:hover:bg-muted"
                >
                  <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                  {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                </button>

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
                        className="flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-background dark:hover:bg-muted"
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
                      className="mt-2 flex w-full cursor-pointer items-center rounded-xl px-4 py-3 text-sm font-medium text-danger transition-colors hover:bg-red-50 dark:hover:bg-red-900/10"
                    >
                      <LogOut size={15} className="mr-3" />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => dispatch(closeMobileMenu())}
                    className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-gradient-to-r from-primary to-primary-dark py-3 text-sm font-semibold text-white shadow-md dark:text-background"
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
