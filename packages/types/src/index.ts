/* ═══════════════════════════════════════════════
   AquaCommerce — Shared Types
   Synced with Prisma schema
   ═══════════════════════════════════════════════ */

// ── Enums ──────────────────────────────────
export type Role = 'USER' | 'ADMIN';
export type CareLevel = 'EASY' | 'MODERATE' | 'HARD' | 'EXPERT';
export type Temperament = 'PEACEFUL' | 'SEMI_AGGRESSIVE' | 'AGGRESSIVE';
export type WaterType = 'FRESHWATER' | 'SALTWATER' | 'BRACKISH';
export type FishSize = 'XS' | 'S' | 'M' | 'L' | 'XL';
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';
export type InventoryAction = 'ADD' | 'RESERVE' | 'RELEASE' | 'SELL' | 'RETURN';
export type MessageRole = 'USER' | 'ASSISTANT';
export type Theme = 'light' | 'dark';
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// ── User ───────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Fish Species ───────────────────────────
export interface FishSpecies {
  id: string;
  name: string;
  scientificName: string;
  description?: string | null;
  careLevel: CareLevel;
  temperament: Temperament;
  waterType: WaterType;
  minTankSize?: number | null;
  minTemp?: number | null;
  maxTemp?: number | null;
  minPh?: number | null;
  maxPh?: number | null;
  maxSize?: number | null;
  lifespan?: string | null;
  diet?: string | null;
  origin?: string | null;
  createdAt: string;
  images?: ProductImage[];
  products?: Product[];
}

// ── Product Image ──────────────────────────
export interface ProductImage {
  id: string;
  speciesId?: string | null;
  productId?: string | null;
  url: string;
  alt?: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

// ── Product ────────────────────────────────
export interface Product {
  id: string;
  speciesId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  size: FishSize;
  age?: string | null;
  gender?: string | null;
  isActive: boolean;
  available: number;
  reserved: number;
  sold: number;
  avgRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  species?: FishSpecies;
  images?: ProductImage[];
}

export interface ProductFilter {
  search?: string;
  speciesId?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: FishSize[];
  waterType?: WaterType[];
  careLevel?: CareLevel[];
  temperament?: Temperament[];
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'popular' | 'rating';
  page?: number;
  limit?: number;
}

// ── Cart ───────────────────────────────────
export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: string;
  product?: Product;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

// ── Order ──────────────────────────────────
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingAddress: string;
  shippingCity: string;
  shippingPhone: string;
  paymentMethod: string;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  user?: Pick<User, 'id' | 'name' | 'email'>;
}

export interface CreateOrderPayload {
  shippingAddress: string;
  shippingCity: string;
  shippingPhone: string;
  paymentMethod?: string;
  note?: string;
}

// ── Review ─────────────────────────────────
export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user?: Pick<User, 'id' | 'name' | 'avatar'>;
  product?: Pick<Product, 'id' | 'name' | 'slug'>;
}

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  comment?: string;
}

// ── Inventory ──────────────────────────────
export interface InventoryLog {
  id: string;
  productId: string;
  action: InventoryAction;
  quantity: number;
  note?: string | null;
  createdAt: string;
  product?: Pick<Product, 'id' | 'name'>;
}

// ── AI Chat ────────────────────────────────
export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  messages?: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export interface AiRecommendation {
  products: Product[];
  reason: string;
}

// ── API Response ───────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  [key: string]: unknown;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  meta: PaginationMeta;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

// ── Admin Stats ────────────────────────────
export interface RevenueTrendItem {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProductItem {
  productId: string;
  name: string;
  totalSold: number;
  orderCount: number;
  image: string | null;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: (Order & { _count?: { items: number }; user?: Pick<User, 'name' | 'email'> })[];
  ordersByStatus: { status: OrderStatus; _count: number }[];
  lowStockProducts: (Product & { images?: ProductImage[] })[];
  revenueTrend: RevenueTrendItem[];
  topProducts: TopProductItem[];
}

// ── Socket Events ──────────────────────────
export interface SocketEvents {
  order_created: Order;
  order_updated: { orderId: string; status: OrderStatus };
  inventory_updated: { productId: string; available: number };
}

// ── Blog ───────────────────────────────────
export type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  status: BlogStatus;
  authorId: string;
  tags: string[];
  viewCount: number;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  author?: Pick<User, 'id' | 'name' | 'avatar'>;
}

export interface BlogFilter {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  status?: BlogStatus;
}

export interface CreateBlogPayload {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  status?: BlogStatus;
}

export interface UpdateBlogPayload extends Partial<CreateBlogPayload> {}

// ── Wishlist ───────────────────────────────
export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product?: Product;
}
