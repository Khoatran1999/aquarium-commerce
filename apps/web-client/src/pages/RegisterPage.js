import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { Input, Button, Alert } from '@repo/ui';
import { useAppDispatch, useAppSelector } from '../store';
import { register as registerAction, clearAuthError } from '../store/auth.slice';
/* ── Validation schema ────────────────── */
const registerSchema = z
    .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
})
    .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
export default function RegisterPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, loading, error } = useAppSelector((s) => s.auth);
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(registerSchema),
    });
    /* Redirect when authenticated */
    useEffect(() => {
        if (isAuthenticated)
            navigate('/', { replace: true });
    }, [isAuthenticated, navigate]);
    /* Clear error on unmount */
    useEffect(() => {
        return () => {
            dispatch(clearAuthError());
        };
    }, [dispatch]);
    const onSubmit = (data) => {
        dispatch(registerAction({ name: data.name, email: data.email, password: data.password }));
    };
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsx("title", { children: "Create Account \u2013 AquaLuxe" }), _jsx("meta", { name: "description", content: "Create your AquaLuxe account to start shopping premium ornamental fish." })] }), _jsx("div", { className: "flex min-h-[70vh] items-center justify-center px-4 py-12", children: _jsxs("div", { className: "bg-card border-border w-full max-w-md rounded-2xl border p-8 shadow-lg", children: [_jsxs("div", { className: "mb-8 text-center", children: [_jsx("h1", { className: "text-foreground text-2xl font-bold", children: "Create your account" }), _jsx("p", { className: "text-muted-foreground mt-2 text-sm", children: "Join AquaLuxe to discover premium ornamental fish" })] }), error && (_jsx(Alert, { variant: "danger", className: "mb-6", children: error })), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "flex flex-col gap-5", children: [_jsx(Input, { label: "Full name", type: "text", placeholder: "John Doe", autoComplete: "name", error: errors.name?.message, ...register('name') }), _jsx(Input, { label: "Email", type: "email", placeholder: "you@example.com", autoComplete: "email", error: errors.email?.message, ...register('email') }), _jsx(Input, { label: "Password", type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", autoComplete: "new-password", error: errors.password?.message, ...register('password') }), _jsx(Input, { label: "Confirm password", type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", autoComplete: "new-password", error: errors.confirmPassword?.message, ...register('confirmPassword') }), _jsx(Button, { type: "submit", size: "lg", className: "mt-2 w-full", disabled: loading, children: loading ? (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx("span", { className: "inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" }), "Creating account\u2026"] })) : ('Create account') })] }), _jsxs("p", { className: "text-muted-foreground mt-6 text-center text-sm", children: ["Already have an account?", ' ', _jsx(Link, { to: "/login", className: "text-primary hover:text-primary-dark font-semibold", children: "Sign in" })] })] }) })] }));
}
