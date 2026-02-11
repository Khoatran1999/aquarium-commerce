import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fish, Eye, EyeOff } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { adminLogin, clearAuthError } from '../../store/auth.slice';

export default function AdminLoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error, user } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') navigate('/admin', { replace: true });
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(adminLogin({ email, password }));
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="bg-card border-border w-full max-w-sm rounded-2xl border p-8 shadow-lg">
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center">
          <div className="bg-primary mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-white">
            <Fish className="h-6 w-6" />
          </div>
          <h1 className="text-foreground text-xl font-bold">AquaAdmin</h1>
          <p className="text-muted-foreground text-sm">Sign in to your admin panel</p>
        </div>

        {error && (
          <div className="bg-danger/10 text-danger mb-4 rounded-lg px-3 py-2 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-foreground mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@aquacommerce.com"
              className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/30 w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
            />
          </div>
          <div>
            <label className="text-foreground mb-1 block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/30 w-full rounded-lg border px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
