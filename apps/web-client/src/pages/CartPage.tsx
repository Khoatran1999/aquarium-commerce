import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store';
import { updateCartItem, removeCartItem } from '../store/cart.slice';
import { Button } from '@repo/ui';
import toast from 'react-hot-toast';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { items, itemCount, loading } = useAppSelector((s) => s.cart);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = subtotal > 0 ? (subtotal >= 100 ? 0 : 9.99) : 0;
  const total = subtotal + shippingFee;

  const handleUpdateQty = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch(updateCartItem({ itemId, quantity }))
      .unwrap()
      .catch((err: string) => toast.error(err));
  };

  const handleRemove = (itemId: string) => {
    dispatch(removeCartItem(itemId))
      .unwrap()
      .then(() => toast.success('Item removed'))
      .catch((err: string) => toast.error(err));
  };

  return (
    <>
      <Helmet>
        <title>Cart – AquaLuxe</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-10">
        <h1 className="text-foreground text-2xl font-bold">
          Shopping Cart{' '}
          {itemCount > 0 && (
            <span className="text-muted-foreground text-lg font-normal">({itemCount} items)</span>
          )}
        </h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 text-6xl">🛒</div>
            <h2 className="text-foreground text-xl font-semibold">Your cart is empty</h2>
            <p className="text-muted-foreground mt-2">
              Discover our amazing ornamental fish collection.
            </p>
            <Link to="/products">
              <Button className="mt-6">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Cart items */}
            <div className="flex flex-col gap-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    className="bg-card border-border shadow-card flex gap-4 rounded-2xl border p-4"
                  >
                    {/* Image */}
                    <Link
                      to={`/products/${item.product?.slug ?? ''}`}
                      className="h-24 w-24 shrink-0 overflow-hidden rounded-xl"
                    >
                      <img
                        src={item.product?.images?.[0]?.url ?? '/placeholder-fish.jpg'}
                        alt={item.product?.name ?? 'Product'}
                        className="h-full w-full object-cover"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <Link to={`/products/${item.product?.slug ?? ''}`}>
                          <h3 className="text-foreground hover:text-primary line-clamp-1 font-semibold transition-colors">
                            {item.product?.name ?? 'Product'}
                          </h3>
                        </Link>
                        <p className="text-muted-foreground mt-0.5 text-xs">
                          {item.product?.species?.name} · Size: {item.product?.size}
                        </p>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        {/* Quantity */}
                        <div className="border-border flex items-center rounded-lg border">
                          <button
                            onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                            disabled={loading || item.quantity <= 1}
                            className="text-foreground hover:bg-muted h-8 w-8 text-sm font-semibold transition-colors disabled:opacity-40"
                          >
                            -
                          </button>
                          <span className="text-foreground w-8 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                            disabled={loading}
                            className="text-foreground hover:bg-muted h-8 w-8 text-sm font-semibold transition-colors disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-primary font-bold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="text-muted-foreground hover:text-danger transition-colors"
                            aria-label="Remove item"
                          >
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order summary */}
            <div className="h-fit lg:sticky lg:top-24">
              <div className="bg-card border-border shadow-card rounded-2xl border p-6">
                <h2 className="text-foreground mb-4 text-lg font-bold">Order Summary</h2>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground font-medium">
                      {shippingFee === 0 ? (
                        <span className="text-success">Free</span>
                      ) : (
                        `$${shippingFee.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  {subtotal > 0 && subtotal < 100 && (
                    <p className="text-info text-xs">
                      Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  )}
                  <div className="border-border my-1 border-t" />
                  <div className="flex justify-between text-base">
                    <span className="text-foreground font-bold">Total</span>
                    <span className="text-primary text-xl font-bold">${total.toFixed(2)}</span>
                  </div>
                </div>
                <Link to="/checkout">
                  <Button size="lg" className="mt-6 w-full">
                    Proceed to Checkout
                  </Button>
                </Link>
                <Link
                  to="/products"
                  className="text-primary mt-3 block text-center text-sm hover:underline"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
