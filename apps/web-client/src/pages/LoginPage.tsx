import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { Input, Button, Alert } from '@repo/ui';
import { useAppDispatch, useAppSelector } from '../store';
import { login, clearAuthError } from '../store/auth.slice';

/* ── Validation schema ────────────────── */
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, error } = useAppSelector((s) => s.auth);

  const from = (location.state as { from?: string })?.from ?? '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'user@aqualuxe.vn',
      password: 'user123',
    },
  });

  /* Redirect if already authenticated */
  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  /* Clear error on unmount */
  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const onSubmit = (data: LoginForm) => {
    dispatch(login(data));
  };

  return (
    <>
      <Helmet>
        <title>Login – AquaLuxe</title>
        <meta
          name="description"
          content="Sign in to your AquaLuxe account to manage orders and track shipments."
        />
      </Helmet>

      <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
        <div className="bg-card border-border w-full max-w-md rounded-2xl border p-8 shadow-lg">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-foreground text-2xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground mt-2 text-sm">Sign in to your AquaLuxe account</p>
          </div>

          {/* Error alert */}
          {error && (
            <Alert variant="danger" className="mb-6">
              {error}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in…
                </span>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-muted-foreground mt-6 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary-dark font-semibold">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
