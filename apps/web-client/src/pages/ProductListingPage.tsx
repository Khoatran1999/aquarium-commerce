import { useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts, useSpeciesList } from '../hooks';
import { useAppDispatch } from '../store';
import { addToCart } from '../store/cart.slice';
import { Button, Skeleton, Pagination, Badge } from '@repo/ui';
import type { ProductFilter, FishSize, WaterType, CareLevel, Temperament } from '@repo/types';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';

/* ── Filter option constants ──────────── */
const SIZE_OPTIONS: { value: FishSize; label: string }[] = [
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
];
const WATER_OPTIONS: { value: WaterType; label: string }[] = [
  { value: 'FRESHWATER', label: 'Freshwater' },
  { value: 'SALTWATER', label: 'Saltwater' },
  { value: 'BRACKISH', label: 'Brackish' },
];
const CARE_OPTIONS: { value: CareLevel; label: string }[] = [
  { value: 'EASY', label: 'Easy' },
  { value: 'MODERATE', label: 'Moderate' },
  { value: 'HARD', label: 'Hard' },
  { value: 'EXPERT', label: 'Expert' },
];
const TEMPERAMENT_OPTIONS: { value: Temperament; label: string }[] = [
  { value: 'PEACEFUL', label: 'Peaceful' },
  { value: 'SEMI_AGGRESSIVE', label: 'Semi-Aggressive' },
  { value: 'AGGRESSIVE', label: 'Aggressive' },
];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Best Rated' },
];

function parseList(val: string | null): string[] {
  return val ? val.split(',').filter(Boolean) : [];
}

export default function ProductListingPage() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  /* ── Read filters from URL ────── */
  const filters = useMemo<ProductFilter>(
    () => ({
      search: searchParams.get('search') ?? undefined,
      speciesId: searchParams.get('speciesId') ?? undefined,
      size: parseList(searchParams.get('size')) as FishSize[] | undefined,
      waterType: parseList(searchParams.get('waterType')) as WaterType[] | undefined,
      careLevel: parseList(searchParams.get('careLevel')) as CareLevel[] | undefined,
      temperament: parseList(searchParams.get('temperament')) as Temperament[] | undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      sortBy: (searchParams.get('sortBy') as ProductFilter['sortBy']) ?? 'newest',
      page: Number(searchParams.get('page') ?? 1),
      limit: 12,
    }),
    [searchParams],
  );

  const { data: response, isLoading } = useProducts(filters);
  const { data: speciesResponse } = useSpeciesList();

  const products = response?.data ?? [];
  const meta = response?.meta;
  const speciesList = speciesResponse?.data ?? [];

  /* ── Filter helpers ─────────── */
  const updateParam = useCallback(
    (key: string, value: string | string[] | null) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value === null || (Array.isArray(value) && value.length === 0)) {
          next.delete(key);
        } else {
          next.set(key, Array.isArray(value) ? value.join(',') : value);
        }
        next.delete('page'); // reset page on filter change
        return next;
      });
    },
    [setSearchParams],
  );

  const toggleArrayParam = useCallback(
    (key: string, val: string) => {
      const current = parseList(searchParams.get(key));
      const next = current.includes(val) ? current.filter((v) => v !== val) : [...current, val];
      updateParam(key, next);
    },
    [searchParams, updateParam],
  );

  const clearAllFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  const activeFilterCount = [
    filters.search,
    filters.speciesId,
    filters.minPrice,
    filters.maxPrice,
    ...(filters.size ?? []),
    ...(filters.waterType ?? []),
    ...(filters.careLevel ?? []),
    ...(filters.temperament ?? []),
  ].filter(Boolean).length;

  const handleAddToCart = (productId: string) => {
    dispatch(addToCart({ productId, quantity: 1 }))
      .unwrap()
      .then(() => toast.success('Added to cart!'))
      .catch((err: string) => toast.error(err));
  };

  /* ── Sidebar filter UI ──────── */
  const FilterSidebar = (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <div>
        <label className="text-foreground mb-2 block text-sm font-semibold">Search</label>
        <input
          type="text"
          defaultValue={filters.search ?? ''}
          placeholder="Search fish..."
          className="border-border bg-background text-foreground focus:border-primary h-10 w-full rounded-lg border px-3 text-sm outline-none transition-colors"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const v = (e.target as HTMLInputElement).value.trim();
              updateParam('search', v || null);
            }
          }}
        />
      </div>

      {/* Species */}
      {speciesList.length > 0 && (
        <div>
          <label className="text-foreground mb-2 block text-sm font-semibold">Species</label>
          <select
            value={filters.speciesId ?? ''}
            onChange={(e) => updateParam('speciesId', e.target.value || null)}
            className="border-border bg-background text-foreground focus:border-primary h-10 w-full rounded-lg border px-3 text-sm outline-none"
          >
            <option value="">All Species</option>
            {speciesList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Price range */}
      <div>
        <label className="text-foreground mb-2 block text-sm font-semibold">Price Range</label>
        <div className="flex gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            defaultValue={filters.minPrice ?? ''}
            className="border-border bg-background text-foreground focus:border-primary h-10 w-full rounded-lg border px-3 text-sm outline-none"
            onBlur={(e) => updateParam('minPrice', e.target.value || null)}
          />
          <input
            type="number"
            min={0}
            placeholder="Max"
            defaultValue={filters.maxPrice ?? ''}
            className="border-border bg-background text-foreground focus:border-primary h-10 w-full rounded-lg border px-3 text-sm outline-none"
            onBlur={(e) => updateParam('maxPrice', e.target.value || null)}
          />
        </div>
      </div>

      {/* Size */}
      <FilterCheckboxGroup
        label="Size"
        options={SIZE_OPTIONS}
        selected={filters.size ?? []}
        onToggle={(v) => toggleArrayParam('size', v)}
      />

      {/* Water type */}
      <FilterCheckboxGroup
        label="Water Type"
        options={WATER_OPTIONS}
        selected={filters.waterType ?? []}
        onToggle={(v) => toggleArrayParam('waterType', v)}
      />

      {/* Care level */}
      <FilterCheckboxGroup
        label="Care Level"
        options={CARE_OPTIONS}
        selected={filters.careLevel ?? []}
        onToggle={(v) => toggleArrayParam('careLevel', v)}
      />

      {/* Temperament */}
      <FilterCheckboxGroup
        label="Temperament"
        options={TEMPERAMENT_OPTIONS}
        selected={filters.temperament ?? []}
        onToggle={(v) => toggleArrayParam('temperament', v)}
      />

      {/* Clear */}
      {activeFilterCount > 0 && (
        <Button variant="outline" size="sm" onClick={clearAllFilters} className="w-full">
          Clear All Filters ({activeFilterCount})
        </Button>
      )}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Products – AquaLuxe</title>
        <meta
          name="description"
          content="Browse our collection of premium ornamental fish. Filter by species, size, water type and more."
        />
        <meta property="og:title" content="Products – AquaLuxe" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-10">
        {/* ── Top bar ─── */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-foreground text-2xl font-bold">All Products</h1>
            {meta && (
              <p className="text-muted-foreground mt-1 text-sm">
                {meta.total} product{meta.total !== 1 ? 's' : ''} found
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setShowMobileFilters(true)}
            >
              Filters {activeFilterCount > 0 && <Badge className="ml-1">{activeFilterCount}</Badge>}
            </Button>

            {/* Sort */}
            <select
              value={filters.sortBy}
              onChange={(e) => updateParam('sortBy', e.target.value)}
              className="border-border bg-background text-foreground h-9 rounded-lg border px-3 text-sm"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            {/* View toggle */}
            <div className="border-border hidden items-center rounded-lg border md:flex">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-muted-foreground'} rounded-l-lg transition-colors`}
              >
                <GridIcon />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-muted-foreground'} rounded-r-lg transition-colors`}
              >
                <ListIcon />
              </button>
            </div>
          </div>
        </div>

        {/* ── Main layout: sidebar + content ─── */}
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden w-64 shrink-0 md:block">{FilterSidebar}</aside>

          {/* Content */}
          <div className="min-w-0 flex-1">
            {isLoading ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 gap-5 lg:grid-cols-3'
                    : 'flex flex-col gap-4'
                }
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl p-4">
                    <Skeleton className="mb-4 aspect-square w-full rounded-xl" />
                    <Skeleton className="mb-2 h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-muted-foreground mb-4 text-6xl">🐟</div>
                <h3 className="text-foreground text-lg font-semibold">No products found</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  Try adjusting your filters or search terms.
                </p>
                {activeFilterCount > 0 && (
                  <Button variant="outline" className="mt-4" onClick={clearAllFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={viewMode + JSON.stringify(filters)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-2 gap-5 lg:grid-cols-3'
                      : 'flex flex-col gap-4'
                  }
                >
                  {products.map((p) =>
                    viewMode === 'grid' ? (
                      <ProductCard key={p.id} product={p} showAddToCart />
                    ) : (
                      <Link
                        key={p.id}
                        to={`/products/${p.slug}`}
                        className="bg-card border-border shadow-card hover:shadow-elevated group flex gap-5 overflow-hidden rounded-2xl border p-4 transition-all"
                      >
                        <div className="h-32 w-32 shrink-0 overflow-hidden rounded-xl">
                          <img
                            src={p.images?.[0]?.url ?? '/placeholder-fish.jpg'}
                            alt={p.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div>
                            <p className="text-muted-foreground text-xs">{p.species?.name}</p>
                            <h3 className="text-foreground mt-1 text-lg font-semibold">{p.name}</h3>
                            <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                              {p.description}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-baseline gap-2">
                              <span className="text-primary text-xl font-bold">
                                ${p.price.toFixed(2)}
                              </span>
                              {p.comparePrice && p.comparePrice > p.price && (
                                <span className="text-muted-foreground text-sm line-through">
                                  ${p.comparePrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleAddToCart(p.id);
                              }}
                            >
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </Link>
                    ),
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  page={meta.page}
                  totalPages={meta.totalPages}
                  onPageChange={(p) => {
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev);
                      next.set('page', String(p));
                      return next;
                    });
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter sheet ─── */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.aside
              className="bg-card fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-3xl p-6"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-foreground text-lg font-bold">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="text-muted-foreground p-2"
                >
                  ✕
                </button>
              </div>
              {FilterSidebar}
              <Button className="mt-6 w-full" onClick={() => setShowMobileFilters(false)}>
                Apply Filters
              </Button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Helper Components ─── */
function FilterCheckboxGroup<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: { value: T; label: string }[];
  selected: T[];
  onToggle: (v: T) => void;
}) {
  return (
    <div>
      <label className="text-foreground mb-2 block text-sm font-semibold">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onToggle(o.value)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              selected.includes(o.value)
                ? 'bg-primary border-primary text-white'
                : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function GridIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
