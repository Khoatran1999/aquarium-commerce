import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fish, Eye, EyeOff } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { login, clearAuthError } from '../store/auth.slice';
export default function LoginPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, loading, error } = useAppSelector((s) => s.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    useEffect(() => {
        if (isAuthenticated)
            navigate('/', { replace: true });
    }, [isAuthenticated, navigate]);
    useEffect(() => {
        return () => {
            dispatch(clearAuthError());
        };
    }, [dispatch]);
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };
    return (_jsx("div", { className: "bg-background flex min-h-screen items-center justify-center p-4", children: _jsxs("div", { className: "bg-card border-border w-full max-w-sm rounded-2xl border p-8 shadow-lg", children: [_jsxs("div", { className: "mb-6 flex flex-col items-center", children: [_jsx("div", { className: "bg-primary mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-white", children: _jsx(Fish, { className: "h-6 w-6" }) }), _jsx("h1", { className: "text-foreground text-xl font-bold", children: "AquaAdmin" }), _jsx("p", { className: "text-muted-foreground text-sm", children: "Sign in to your admin panel" })] }), error && (_jsx("div", { className: "bg-danger/10 text-danger mb-4 rounded-lg px-3 py-2 text-sm", children: error })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-foreground mb-1 block text-sm font-medium", children: "Email" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, placeholder: "admin@aquacommerce.com", className: "bg-card border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/30 w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-foreground mb-1 block text-sm font-medium", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: showPassword ? 'text' : 'password', value: password, onChange: (e) => setPassword(e.target.value), required: true, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "bg-card border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/30 w-full rounded-lg border px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2" }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2", children: showPassword ? _jsx(EyeOff, { className: "h-4 w-4" }) : _jsx(Eye, { className: "h-4 w-4" }) })] })] }), _jsx("button", { type: "submit", disabled: loading, className: "bg-primary w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-50", children: loading ? 'Signing in...' : 'Sign In' })] })] }) }));
}
