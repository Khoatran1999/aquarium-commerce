import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@repo/ui';

export default function OrderSuccessPage() {
  const location = useLocation();
  const orderId = (location.state as { orderId?: string })?.orderId;

  return (
    <>
      <Helmet>
        <title>Order Successful – AquaLuxe</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="mx-auto flex min-h-[60vh] max-w-[1280px] items-center justify-center px-4 py-16 md:px-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated check */}
          <motion.div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <motion.svg
              className="h-10 w-10 text-emerald-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </motion.svg>
          </motion.div>

          <h1 className="text-foreground text-3xl font-bold">Order Placed Successfully!</h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Thank you for shopping at AquaLuxe. We&apos;ll take great care of your new aquatic
            friends!
          </p>

          {orderId && (
            <motion.div
              className="bg-card border-border shadow-card mx-auto mt-8 max-w-sm rounded-2xl border p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-muted-foreground mb-1 text-sm">Order ID</p>
              <p className="text-foreground break-all font-mono text-sm font-semibold">{orderId}</p>
              <Link to={`/orders/${orderId}`}>
                <Button variant="outline" size="sm" className="mt-4 w-full">
                  View Order Details
                </Button>
              </Link>
            </motion.div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/orders">
              <Button variant="outline">My Orders</Button>
            </Link>
            <Link to="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>

          {/* Fun fish animation */}
          <motion.div
            className="mt-12 text-5xl"
            animate={{ x: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            🐠
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
