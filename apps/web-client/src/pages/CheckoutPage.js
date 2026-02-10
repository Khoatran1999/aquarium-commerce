import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
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
const PAYMENT_METHODS = [
    { value: 'COD', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive your order' },
    {
        value: 'BANK_TRANSFER',
        label: 'Bank Transfer',
        icon: '🏦',
        desc: 'Transfer to our bank account',
    },
    { value: 'E_WALLET', label: 'E-Wallet', icon: '📱', desc: 'Pay via digital wallet' },
];
export default function CheckoutPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { items } = useAppSelector((s) => s.cart);
    const { user } = useAppSelector((s) => s.auth);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingFee = subtotal >= 100 ? 0 : 9.99;
    const total = subtotal + shippingFee;
    const { register, handleSubmit, watch, setValue, formState: { errors }, } = useForm({
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
    const onSubmit = async (data) => {
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
        }
        catch (err) {
            const msg = err?.message ?? 'Failed to place order';
            setError(msg);
            toast.error(msg);
        }
        finally {
            setSubmitting(false);
        }
    };
    if (items.length === 0) {
        return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsx("title", { children: "Checkout \u2013 AquaLuxe" }), _jsx("meta", { name: "robots", content: "noindex" })] }), _jsxs("div", { className: "flex min-h-[60vh] flex-col items-center justify-center text-center", children: [_jsx("p", { className: "text-muted-foreground", children: "Your cart is empty. Add some products first!" }), _jsx(Button, { className: "mt-4", onClick: () => navigate('/products'), children: "Browse Products" })] })] }));
    }
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsx("title", { children: "Checkout \u2013 AquaLuxe" }), _jsx("meta", { name: "robots", content: "noindex" })] }), _jsxs("div", { className: "mx-auto max-w-[1280px] px-4 py-8 md:px-10", children: [_jsx("h1", { className: "text-foreground mb-8 text-2xl font-bold", children: "Checkout" }), error && (_jsx(Alert, { variant: "danger", className: "mb-6", children: error })), _jsx("form", { onSubmit: handleSubmit(onSubmit), children: _jsxs("div", { className: "grid gap-8 lg:grid-cols-[1fr_400px]", children: [_jsxs("div", { className: "flex flex-col gap-8", children: [_jsxs("section", { className: "bg-card border-border rounded-2xl border p-6", children: [_jsx("h2", { className: "text-foreground mb-5 text-lg font-bold", children: "Shipping Information" }), _jsxs("div", { className: "flex flex-col gap-4", children: [_jsx(Input, { label: "Phone Number", type: "tel", placeholder: "+1 234 567 890", error: errors.shippingPhone?.message, ...register('shippingPhone') }), _jsx(Input, { label: "Address", placeholder: "123 Main St, Apt 4", error: errors.shippingAddress?.message, ...register('shippingAddress') }), _jsx(Input, { label: "City", placeholder: "New York", error: errors.shippingCity?.message, ...register('shippingCity') }), _jsxs("div", { children: [_jsx("label", { className: "text-foreground mb-1.5 block text-sm font-medium", children: "Note (optional)" }), _jsx("textarea", { className: "border-border bg-background text-foreground focus:border-primary w-full rounded-lg border p-3 text-sm outline-none transition-colors", rows: 2, placeholder: "Delivery instructions...", ...register('note') })] })] })] }), _jsxs("section", { className: "bg-card border-border rounded-2xl border p-6", children: [_jsx("h2", { className: "text-foreground mb-5 text-lg font-bold", children: "Payment Method" }), _jsx("div", { className: "flex flex-col gap-3", children: PAYMENT_METHODS.map((pm) => (_jsxs("label", { className: `flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-colors ${selectedPayment === pm.value
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-border hover:border-primary/40'}`, children: [_jsx("input", { type: "radio", value: pm.value, className: "sr-only", ...register('paymentMethod'), onChange: () => setValue('paymentMethod', pm.value) }), _jsx("span", { className: "text-2xl", children: pm.icon }), _jsxs("div", { children: [_jsx("p", { className: "text-foreground font-semibold", children: pm.label }), _jsx("p", { className: "text-muted-foreground text-xs", children: pm.desc })] }), selectedPayment === pm.value && (_jsx(motion.div, { className: "bg-primary ml-auto flex h-6 w-6 items-center justify-center rounded-full text-white", initial: { scale: 0 }, animate: { scale: 1 }, children: "\u2713" }))] }, pm.value))) })] })] }), _jsx("div", { className: "h-fit lg:sticky lg:top-24", children: _jsxs("div", { className: "bg-card border-border shadow-card rounded-2xl border p-6", children: [_jsx("h2", { className: "text-foreground mb-4 text-lg font-bold", children: "Order Summary" }), _jsx("div", { className: "mb-4 flex flex-col gap-3", children: items.map((item) => (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("img", { src: item.product?.images?.[0]?.url ?? '/placeholder-fish.jpg', alt: item.product?.name ?? '', className: "h-12 w-12 rounded-lg object-cover" }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "text-foreground line-clamp-1 text-sm font-medium", children: item.product?.name }), _jsxs("p", { className: "text-muted-foreground text-xs", children: ["Qty: ", item.quantity] })] }), _jsxs("span", { className: "text-foreground text-sm font-semibold", children: ["$", (item.price * item.quantity).toFixed(2)] })] }, item.id))) }), _jsx("div", { className: "border-border border-t pt-3", children: _jsxs("div", { className: "flex flex-col gap-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Subtotal" }), _jsxs("span", { className: "text-foreground", children: ["$", subtotal.toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Shipping" }), _jsx("span", { className: "text-foreground", children: shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}` })] }), _jsx("div", { className: "border-border my-1 border-t" }), _jsxs("div", { className: "flex justify-between text-lg", children: [_jsx("span", { className: "text-foreground font-bold", children: "Total" }), _jsxs("span", { className: "text-primary font-bold", children: ["$", total.toFixed(2)] })] })] }) }), _jsx(Button, { type: "submit", size: "lg", className: "mt-6 w-full", disabled: submitting, children: submitting ? 'Placing Order…' : `Place Order · $${total.toFixed(2)}` })] }) })] }) })] })] }));
}
