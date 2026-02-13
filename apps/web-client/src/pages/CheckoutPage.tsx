import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Banknote, Building2, Smartphone, Check } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store';
import { clearCart } from '../store/cart.slice';
import { orderService } from '@repo/services';
import { Input, Button, Alert } from '@repo/ui';
import toast from 'react-hot-toast';

const checkoutSchema = z.object({
  shippingPhone: z.string().min(9, 'Phone must be at least 9 characters'),
  shippingAddress: z.string().min(10, 'Address must be at least 10 characters'),
  shippingCity: z.string().min(2, 'City is required'),
  paymentMethod: z.enum(['COD', 'BANK_TRANSFER', 'E_WALLET']),
  note: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const PAYMENT_METHODS = [
  {
    value: 'COD',
    label: 'Cash on Delivery',
    icon: Banknote,
    desc: 'Pay when you receive your order',
  },
  {
    value: 'BANK_TRANSFER',
    label: 'Bank Transfer',
    icon: Building2,
    desc: 'Transfer to our bank account',
  },
  { value: 'E_WALLET', label: 'E-Wallet', icon: Smartphone, desc: 'Pay via digital wallet' },
] as const;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((s) => s.cart);
  const { user } = useAppSelector((s) => s.auth);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = subtotal >= 100 ? 0 : 9.99;
  const total = subtotal + shippingFee;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingPhone: user?.phone ?? '',
      shippingAddress: user?.address ?? '',
      shippingCity: '',
      paymentMethod: 'COD',
      note: '',
    },
  });

  const selectedPayment = watch('paymentMethod');

  const onSubmit = async (data: CheckoutForm) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await orderService.createOrder(data);
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate('/order-success', { state: { orderId: res.data.id } });
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? 'Failed to place order';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Checkout – AquaLuxe</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <p className="text-muted-foreground">Your cart is empty. Add some products first!</p>
          <Button className="mt-4" onClick={() => navigate('/products')}>
            Browse Products
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout – AquaLuxe</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-10">
        <h1 className="text-foreground mb-8 text-2xl font-bold">Checkout</h1>

        {error && (
          <Alert variant="danger" className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            {/* Left — form */}
            <div className="flex flex-col gap-8">
              {/* Shipping */}
              <section className="bg-card border-border rounded-2xl border p-6">
                <h2 className="text-foreground mb-5 text-lg font-bold">Shipping Information</h2>
                <div className="flex flex-col gap-4">
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="+1 234 567 890"
                    error={errors.shippingPhone?.message}
                    {...register('shippingPhone')}
                  />
                  <Input
                    label="Address"
                    placeholder="123 Main St, Apt 4"
                    error={errors.shippingAddress?.message}
                    {...register('shippingAddress')}
                  />
                  <Input
                    label="City"
                    placeholder="New York"
                    error={errors.shippingCity?.message}
                    {...register('shippingCity')}
                  />
                  <div>
                    <label className="text-foreground mb-1.5 block text-sm font-medium">
                      Note (optional)
                    </label>
                    <textarea
                      className="border-border bg-background text-foreground focus:border-primary w-full rounded-lg border p-3 text-sm outline-none transition-colors"
                      rows={2}
                      placeholder="Delivery instructions..."
                      {...register('note')}
                    />
                  </div>
                </div>
              </section>

              {/* Payment */}
              <section className="bg-card border-border rounded-2xl border p-6">
                <h2 className="text-foreground mb-5 text-lg font-bold">Payment Method</h2>
                <div className="flex flex-col gap-3">
                  {PAYMENT_METHODS.map((pm) => (
                    <label
                      key={pm.value}
                      className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-colors ${
                        selectedPayment === pm.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <input
                        type="radio"
                        value={pm.value}
                        className="sr-only"
                        {...register('paymentMethod')}
                        onChange={() => setValue('paymentMethod', pm.value)}
                      />
                      <span className="text-primary">
                        <pm.icon size={24} />
                      </span>
                      <div>
                        <p className="text-foreground font-semibold">{pm.label}</p>
                        <p className="text-muted-foreground text-xs">{pm.desc}</p>
                      </div>
                      {selectedPayment === pm.value && (
                        <motion.div
                          className="bg-primary ml-auto flex h-6 w-6 items-center justify-center rounded-full text-white"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <Check size={14} />
                        </motion.div>
                      )}
                    </label>
                  ))}
                </div>
              </section>
            </div>

            {/* Right — order summary */}
            <div className="h-fit lg:sticky lg:top-24">
              <div className="bg-card border-border shadow-card rounded-2xl border p-6">
                <h2 className="text-foreground mb-4 text-lg font-bold">Order Summary</h2>

                {/* Items */}
                <div className="mb-4 flex flex-col gap-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.product?.images?.[0]?.url ?? '/placeholder-fish.jpg'}
                        alt={item.product?.name ?? ''}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground line-clamp-1 text-sm font-medium">
                          {item.product?.name}
                        </p>
                        <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-foreground text-sm font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-border border-t pt-3">
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-foreground">
                        {shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="border-border my-1 border-t" />
                    <div className="flex justify-between text-lg">
                      <span className="text-foreground font-bold">Total</span>
                      <span className="text-primary font-bold">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button type="submit" size="lg" className="mt-6 w-full" disabled={submitting}>
                  {submitting ? 'Placing Order…' : `Place Order · $${total.toFixed(2)}`}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
