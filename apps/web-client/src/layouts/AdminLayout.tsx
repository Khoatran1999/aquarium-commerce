import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Fish,
  ShoppingCart,
  Package,
  Layers,
  ChevronLeft,
  Sun,
  Moon,
  Bell,
  LogOut,
  User,
  Menu,
  X,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleTheme, toggleSidebar } from '../store/ui.slice';
import { logout } from '../store/auth.slice';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Inventory', href: '/admin/inventory', icon: Layers },
  { label: 'Species', href: '/admin/species', icon: Fish },
];

function Breadcrumb() {
  const { pathname } = useLocation();
  // Strip /admin prefix for breadcrumb display
  const adminPath = pathname.replace(/^\/admin\/?/, '');
  const segments = adminPath.split('/').filter(Boolean);
  if (segments.length === 0)
    return <span className="text-foreground text-sm font-medium">Dashboard</span>;
  return (
    <div className="flex items-center gap-1 text-sm">
      <NavLink
        to="/admin"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        Dashboard
      </NavLink>
      {segments.map((seg, i) => (
        <span key={seg} className="flex items-center gap-1">
          <span className="text-muted-foreground">/</span>
          {i === segments.length - 1 ? (
            <span className="text-foreground font-medium capitalize">{seg.replace(/-/g, ' ')}</span>
          ) : (
            <NavLink
              to={'/admin/' + segments.slice(0, i + 1).join('/')}
              className="text-muted-foreground hover:text-foreground capitalize transition-colors"
            >
              {seg.replace(/-/g, ' ')}
            </NavLink>
          )}
        </span>
      ))}
    </div>
  );
}

export default function AdminLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { theme, sidebarCollapsed } = useAppSelector((s) => s.ui);
  const { user } = useAppSelector((s) => s.auth);
  const [userOpen, setUserOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  const sidebarContent = (
    <nav className="flex-1 space-y-1 p-2">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === '/admin'}
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`
          }
        >
          <item.icon className="h-5 w-5 shrink-0" />
          {!sidebarCollapsed && <span>{item.label}</span>}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="bg-background flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside
        className={`bg-sidebar border-border hidden flex-col border-r transition-all duration-200 md:flex ${
          sidebarCollapsed ? 'w-16' : 'w-60'
        }`}
      >
        <div className="border-border flex h-14 items-center gap-2 border-b px-4">
          <div className="bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white">
            A
          </div>
          {!sidebarCollapsed && (
            <span className="text-foreground text-sm font-bold tracking-tight">AquaAdmin</span>
          )}
        </div>
        {sidebarContent}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="text-muted-foreground hover:bg-muted m-2 flex items-center justify-center rounded-lg p-2"
        >
          <ChevronLeft
            className={`h-5 w-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-sidebar fixed inset-y-0 left-0 z-50 flex w-60 flex-col md:hidden"
            >
              <div className="border-border flex h-14 items-center justify-between border-b px-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white">
                    A
                  </div>
                  <span className="text-foreground text-sm font-bold">AquaAdmin</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="text-muted-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-border flex h-14 items-center justify-between border-b px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="text-muted-foreground hover:bg-muted rounded-lg p-1.5 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Breadcrumb />
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="text-muted-foreground hover:bg-muted rounded-lg p-2 transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Notifications */}
            <button className="text-muted-foreground hover:bg-muted relative rounded-lg p-2 transition-colors">
              <Bell className="h-4 w-4" />
            </button>

            {/* User Dropdown */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="hover:bg-muted flex items-center gap-2 rounded-lg p-1.5 transition-colors"
              >
                <div className="bg-primary/20 text-primary flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold">
                  {user?.name?.[0]?.toUpperCase() ?? 'A'}
                </div>
                {user && (
                  <span className="text-foreground hidden text-xs font-medium md:block">
                    {user.name}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {userOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    transition={{ duration: 0.12 }}
                    className="bg-card border-border shadow-elevated absolute right-0 top-full mt-1 w-48 rounded-lg border py-1"
                  >
                    <div className="border-border border-b px-3 py-2">
                      <p className="text-foreground text-sm font-medium">{user?.name}</p>
                      <p className="text-muted-foreground text-xs">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setUserOpen(false);
                        navigate('/');
                      }}
                      className="text-muted-foreground hover:bg-muted hover:text-foreground flex w-full items-center gap-2 px-3 py-2 text-sm"
                    >
                      <User className="h-4 w-4" />
                      Back to Store
                    </button>
                    <button
                      onClick={handleLogout}
                      className="text-danger hover:bg-danger/10 flex w-full items-center gap-2 px-3 py-2 text-sm"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="bg-background flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
