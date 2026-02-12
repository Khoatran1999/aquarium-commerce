import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useProduct, useProducts, useReviews } from '../hooks';
import { useAppDispatch, useAppSelector } from '../store';
import { addToCart } from '../store/cart.slice';
import { Button, Skeleton, Badge, Tabs } from '@repo/ui';
import type { FishSize } from '@repo/types';
import toast from 'react-hot-toast';
import ReviewSection from '../components/product/ReviewSection';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  const { data: res, isLoading } = useProduct(slug ?? '');
  const product = res?.data;

  const { data: relatedRes } = useProducts(
    product ? { speciesId: product.speciesId, limit: 4 } : undefined,
  );
  const related = (relatedRes?.data ?? []).filter((p) => p.id !== product?.id).slice(0, 4);

  const { data: reviewsRes } = useReviews(product?.id ?? '');
  const reviews = reviewsRes?.data ?? [];

  const [mainImage, setMainImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-10">
        <div className="grid gap-10 md:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h2 className="text-foreground text-2xl font-bold">Product not found</h2>
        <Link to="/products" className="text-primary mt-4 hover:underline">
          Browse all products
        </Link>
      </div>
    );
  }

  const images = product.images ?? [];
  const currentImg = images[mainImage]?.url ?? '/placeholder-fish.jpg';
  const inStock = product.available > 0;

  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product.id, quantity, product }))
      .unwrap()
      .then(() => toast.success(`${product.name} added to cart!`))
      .catch((err: string) => toast.error(err));
  };

  const sizeLabels: Record<FishSize, string> = {
    XS: 'Extra Small (< 3cm)',
    S: 'Small (3–5cm)',
    M: 'Medium (5–10cm)',
    L: 'Large (10–20cm)',
    XL: 'Extra Large (> 20cm)',
  };

  return (
    <>
      <Helmet>
        <title>{product.name} – AquaLuxe</title>
        <meta
          name="description"
          content={product.description?.slice(0, 160) ?? `Buy ${product.name} at AquaLuxe`}
        />
        <meta property="og:title" content={`${product.name} – AquaLuxe`} />
        <meta property="og:description" content={product.description?.slice(0, 160) ?? ''} />
        <meta property="og:type" content="product" />
        {product.images?.[0]?.url && <meta property="og:image" content={product.images[0].url} />}
      </Helmet>

      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-10">
        {/* Breadcrumb */}
        <nav className="text-muted-foreground mb-6 flex items-center gap-2 text-sm">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary">
            Products
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* ── Main section ─── */}
        <div className="grid gap-10 md:grid-cols-2">
          {/* Image gallery */}
          <div>
            <motion.div
              key={mainImage}
              className="mb-4 aspect-square overflow-hidden rounded-2xl bg-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <img src={currentImg} alt={product.name} className="h-full w-full object-cover" />
            </motion.div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setMainImage(i)}
                    className={`h-20 w-20 overflow-hidden rounded-xl border-2 transition-colors ${
                      i === mainImage ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img.url} alt={img.alt ?? ''} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="flex flex-col gap-4">
            {product.species && (
              <p className="text-muted-foreground text-sm">{product.species.name}</p>
            )}
            <h1 className="text-foreground text-3xl font-bold">{product.name}</h1>

            {/* Rating */}
            {product.avgRating > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-accent">{'★'.repeat(Math.round(product.avgRating))}</span>
                <span className="text-muted-foreground text-sm">
                  {product.avgRating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-primary text-3xl font-bold">${product.price.toFixed(2)}</span>
              {product.comparePrice && product.comparePrice > product.price && (
                <>
                  <span className="text-muted-foreground text-lg line-through">
                    ${product.comparePrice.toFixed(2)}
                  </span>
                  <Badge variant="danger">
                    -
                    {Math.round(
                      ((product.comparePrice - product.price) / product.comparePrice) * 100,
                    )}
                    %
                  </Badge>
                </>
              )}
            </div>

            {/* Size */}
            <div className="flex items-center gap-2">
              <span className="text-foreground text-sm font-semibold">Size:</span>
              <Badge>{sizeLabels[product.size]}</Badge>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${inStock ? 'bg-success' : 'bg-danger'}`} />
              <span className={`text-sm font-medium ${inStock ? 'text-success' : 'text-danger'}`}>
                {inStock ? `${product.available} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="mt-2 flex items-center gap-4">
              <div className="border-border flex items-center rounded-xl border">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-foreground hover:bg-muted h-12 w-12 text-lg font-semibold transition-colors"
                >
                  -
                </button>
                <span className="text-foreground w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.available, q + 1))}
                  className="text-foreground hover:bg-muted h-12 w-12 text-lg font-semibold transition-colors"
                >
                  +
                </button>
              </div>
              <Button size="lg" className="flex-1" disabled={!inStock} onClick={handleAddToCart}>
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>

            {/* Quick info */}
            {product.species && (
              <div className="border-border mt-4 grid grid-cols-2 gap-3 rounded-xl border p-4">
                <InfoRow label="Water Type" value={product.species.waterType} />
                <InfoRow label="Care Level" value={product.species.careLevel} />
                <InfoRow label="Temperament" value={product.species.temperament} />
                {product.species.minTankSize && (
                  <InfoRow label="Min Tank" value={`${product.species.minTankSize}L`} />
                )}
                {product.age && <InfoRow label="Age" value={product.age} />}
                {product.gender && <InfoRow label="Gender" value={product.gender} />}
              </div>
            )}
          </div>
        </div>

        {/* ── Tabs ─── */}
        <div className="mt-12">
          <Tabs
            items={[
              {
                value: 'description',
                label: 'Description',
                content: (
                  <div className="text-foreground prose max-w-none py-6 leading-relaxed">
                    <p>{product.description}</p>
                  </div>
                ),
              },
              {
                value: 'care',
                label: 'Care Guide',
                content: (
                  <div className="py-6">
                    {product.species ? (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {product.species.minTemp != null && product.species.maxTemp != null && (
                          <CareCard
                            icon="🌡️"
                            title="Temperature"
                            value={`${product.species.minTemp}°C – ${product.species.maxTemp}°C`}
                          />
                        )}
                        {product.species.minPh != null && product.species.maxPh != null && (
                          <CareCard
                            icon="⚗️"
                            title="pH Level"
                            value={`${product.species.minPh} – ${product.species.maxPh}`}
                          />
                        )}
                        {product.species.minTankSize && (
                          <CareCard
                            icon="🐠"
                            title="Min Tank Size"
                            value={`${product.species.minTankSize} liters`}
                          />
                        )}
                        {product.species.maxSize && (
                          <CareCard
                            icon="📏"
                            title="Max Size"
                            value={`${product.species.maxSize} cm`}
                          />
                        )}
                        {product.species.diet && (
                          <CareCard icon="🍽️" title="Diet" value={product.species.diet} />
                        )}
                        {product.species.lifespan && (
                          <CareCard icon="⏳" title="Lifespan" value={product.species.lifespan} />
                        )}
                        {product.species.origin && (
                          <CareCard icon="🌍" title="Origin" value={product.species.origin} />
                        )}
                        <CareCard
                          icon="💧"
                          title="Water Type"
                          value={product.species.waterType.replace('_', ' ')}
                        />
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No care information available.</p>
                    )}
                  </div>
                ),
              },
              {
                value: 'reviews',
                label: `Reviews (${product.reviewCount})`,
                content: (
                  <ReviewSection
                    productId={product.id}
                    reviews={reviews}
                    avgRating={product.avgRating}
                    reviewCount={product.reviewCount}
                    isAuthenticated={isAuthenticated}
                  />
                ),
              },
            ]}
          />
        </div>

        {/* ── Related Products ─── */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-foreground mb-6 text-2xl font-bold">Related Fish</h2>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.slug}`}
                  className="bg-card border-border shadow-card hover:shadow-elevated group block overflow-hidden rounded-2xl border transition-all hover:-translate-y-1"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={p.images?.[0]?.url ?? '/placeholder-fish.jpg'}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-foreground line-clamp-1 text-sm font-semibold">{p.name}</h3>
                    <span className="text-primary mt-1 block font-bold">${p.price.toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

/* ── Small helper components ─── */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-muted-foreground text-xs">{label}</span>
      <p className="text-foreground text-sm font-medium capitalize">
        {value.toLowerCase().replace(/_/g, ' ')}
      </p>
    </div>
  );
}

function CareCard({ icon, title, value }: { icon: string; title: string; value: string }) {
  return (
    <div className="bg-muted/50 flex items-start gap-3 rounded-xl p-4">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-muted-foreground text-xs">{title}</p>
        <p className="text-foreground text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}
