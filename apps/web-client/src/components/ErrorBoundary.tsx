import React, { Component, type ReactNode } from 'react';
import { Fish } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
          <div className="mb-6">
            <Fish size={56} className="text-muted-foreground/40 mx-auto" />
          </div>
          <h1 className="text-foreground mb-2 text-2xl font-bold">Something went wrong</h1>
          <p className="text-muted-foreground mb-6 max-w-md text-sm">
            An unexpected error occurred. Please try refreshing the page or go back to the homepage.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <pre className="bg-muted text-danger mb-6 max-w-lg overflow-auto rounded-lg p-4 text-left text-xs">
              {this.state.error.message}
            </pre>
          )}
          <div className="flex gap-3">
            <button
              onClick={this.handleReset}
              className="bg-primary hover:bg-primary/90 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors"
            >
              Try Again
            </button>
            <a
              href="/"
              className="border-border text-foreground hover:bg-muted rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors"
            >
              Go Home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
