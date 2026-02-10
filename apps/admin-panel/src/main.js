import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import './index.css';
const queryClient = new QueryClient({
    defaultOptions: {
        queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
    },
});
createRoot(document.getElementById('root')).render(_jsx(StrictMode, { children: _jsx(Provider, { store: store, children: _jsx(QueryClientProvider, { client: queryClient, children: _jsx(BrowserRouter, { basename: "/admin", children: _jsx(App, {}) }) }) }) }));
