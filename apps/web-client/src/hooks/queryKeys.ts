/**
 * TanStack Query key factory — ensures consistent, type-safe keys
 * across all query/mutation hooks in the web-client.
 */
export const queryKeys = {
  /* ── Products ─── */
  products: {
    all: ['products'] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.products.all, 'list', params] as const,
    detail: (slug: string) => [...queryKeys.products.all, 'detail', slug] as const,
    search: (q: string) => [...queryKeys.products.all, 'search', q] as const,
  },

  /* ── Species ─── */
  species: {
    all: ['species'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.species.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.species.all, 'detail', id] as const,
  },

  /* ── Cart ─── */
  cart: {
    all: ['cart'] as const,
  },

  /* ── Orders ─── */
  orders: {
    all: ['orders'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.orders.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.orders.all, 'detail', id] as const,
  },

  /* ── Reviews ─── */
  reviews: {
    all: ['reviews'] as const,
    byProduct: (productId: string) => [...queryKeys.reviews.all, 'product', productId] as const,
  },

  /* ── Auth / User ─── */
  auth: {
    me: ['auth', 'me'] as const,
  },

  /* ── AI ─── */
  ai: {
    sessions: ['ai', 'sessions'] as const,
    messages: (sessionId: string) => ['ai', 'messages', sessionId] as const,
  },

  /* ── Blogs ─── */
  blogs: {
    all: ['blogs'] as const,
    list: (filter?: Record<string, unknown>) => [...queryKeys.blogs.all, 'list', filter] as const,
    detail: (slug: string) => [...queryKeys.blogs.all, 'detail', slug] as const,
  },

  /* ── Wishlist ─── */
  wishlist: {
    all: ['wishlist'] as const,
    list: () => [...queryKeys.wishlist.all, 'list'] as const,
    ids: () => [...queryKeys.wishlist.all, 'ids'] as const,
    check: (productId: string) => [...queryKeys.wishlist.all, 'check', productId] as const,
  },
} as const;
