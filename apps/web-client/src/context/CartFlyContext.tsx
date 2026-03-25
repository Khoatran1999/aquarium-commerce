import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

interface CartFlyContextValue {
  cartIconRef: React.RefObject<HTMLButtonElement | null>;
  triggerFly: (fromRect: DOMRect) => void;
}

const CartFlyContext = createContext<CartFlyContextValue | null>(null);

interface Particle {
  id: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

let nextId = 0;

export function CartFlyProvider({ children }: { children: React.ReactNode }) {
  const cartIconRef = useRef<HTMLButtonElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  const triggerFly = useCallback((fromRect: DOMRect) => {
    if (!cartIconRef.current) return;
    const toRect = cartIconRef.current.getBoundingClientRect();
    const fromX = fromRect.left + fromRect.width / 2;
    const fromY = fromRect.top + fromRect.height / 2;
    const toX = toRect.left + toRect.width / 2;
    const toY = toRect.top + toRect.height / 2;
    const id = nextId++;
    setParticles((prev) => [...prev, { id, fromX, fromY, toX, toY }]);
  }, []);

  const removeParticle = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <CartFlyContext.Provider value={{ cartIconRef, triggerFly }}>
      {children}
      {createPortal(
        <>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="pointer-events-none fixed z-[9999]"
              style={{ left: p.fromX, top: p.fromY, translateX: '-50%', translateY: '-50%' }}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{
                x: p.toX - p.fromX,
                y: p.toY - p.fromY,
                scale: 0.35,
                opacity: 0,
              }}
              transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
              onAnimationComplete={() => removeParticle(p.id)}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0094C4] shadow-lg dark:bg-[#00CCEE]">
                <ShoppingCart size={14} className="text-white dark:text-[#000F1E]" />
              </div>
            </motion.div>
          ))}
        </>,
        document.body,
      )}
    </CartFlyContext.Provider>
  );
}

export function useCartFly() {
  const ctx = useContext(CartFlyContext);
  if (!ctx) throw new Error('useCartFly must be used within CartFlyProvider');
  return ctx;
}
