import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, info) {
        console.error('[ErrorBoundary]', error, info.componentStack);
    }
    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };
    render() {
        if (this.state.hasError) {
            if (this.props.fallback)
                return this.props.fallback;
            return (_jsxs("div", { className: "flex min-h-[70vh] flex-col items-center justify-center px-4 text-center", children: [_jsx("div", { className: "mb-6 text-5xl", children: "\u26A0\uFE0F" }), _jsx("h1", { className: "text-foreground mb-2 text-xl font-bold", children: "Something went wrong" }), _jsx("p", { className: "text-muted-foreground mb-6 max-w-md text-sm", children: "An unexpected error occurred in the admin panel." }), import.meta.env.DEV && this.state.error && (_jsx("pre", { className: "bg-muted text-danger mb-6 max-w-lg overflow-auto rounded-lg p-4 text-left text-xs", children: this.state.error.message })), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: this.handleReset, className: "bg-primary hover:bg-primary/90 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors", children: "Try Again" }), _jsx("a", { href: "/admin", className: "border-border text-foreground hover:bg-muted rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors", children: "Dashboard" })] })] }));
        }
        return this.props.children;
    }
}
