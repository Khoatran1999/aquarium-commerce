/**
 * TanStack Query key factory — ensures consistent, type-safe keys
 * across all query/mutation hooks in the web-client.
 */
export const queryKeys = {
    /* ── Products ─── */
    products: {
        all: ['products'],
        list: (params) => [...queryKeys.products.all, 'list', params],
        detail: (slug) => [...queryKeys.products.all, 'detail', slug],
        search: (q) => [...queryKeys.products.all, 'search', q],
    },
    /* ── Species ─── */
    species: {
        all: ['species'],
        list: (params) => [...queryKeys.species.all, 'list', params],
        detail: (id) => [...queryKeys.species.all, 'detail', id],
    },
    /* ── Cart ─── */
    cart: {
        all: ['cart'],
    },
    /* ── Orders ─── */
    orders: {
        all: ['orders'],
        list: (params) => [...queryKeys.orders.all, 'list', params],
        detail: (id) => [...queryKeys.orders.all, 'detail', id],
    },
    /* ── Reviews ─── */
    reviews: {
        all: ['reviews'],
        byProduct: (productId) => [...queryKeys.reviews.all, 'product', productId],
    },
    /* ── Auth / User ─── */
    auth: {
        me: ['auth', 'me'],
    },
    /* ── AI ─── */
    ai: {
        sessions: ['ai', 'sessions'],
        messages: (sessionId) => ['ai', 'messages', sessionId],
    },
};
