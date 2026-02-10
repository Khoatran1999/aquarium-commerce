import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../store';
import { fetchMe } from '../store/auth.slice';
import { authService } from '@repo/services';
import { Input, Button, Alert } from '@repo/ui';
import toast from 'react-hot-toast';
const profileSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    phone: z.string().optional(),
    address: z.string().optional(),
});
export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((s) => s.auth);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const { register, handleSubmit, formState: { errors, isDirty }, } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name ?? '',
            phone: user?.phone ?? '',
            address: user?.address ?? '',
        },
    });
    const onSubmit = async (data) => {
        setSaving(true);
        setError(null);
        try {
            await authService.updateProfile(data);
            await dispatch(fetchMe());
            toast.success('Profile updated!');
        }
        catch (err) {
            const msg = err?.message ?? 'Update failed';
            setError(msg);
            toast.error(msg);
        }
        finally {
            setSaving(false);
        }
    };
    if (!user)
        return null;
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsx("title", { children: "My Profile \u2013 AquaLuxe" }), _jsx("meta", { name: "robots", content: "noindex" })] }), _jsxs("div", { className: "mx-auto max-w-[1280px] px-4 py-8 md:px-10", children: [_jsx("h1", { className: "text-foreground mb-8 text-2xl font-bold", children: "My Profile" }), _jsxs("div", { className: "grid gap-8 lg:grid-cols-[300px_1fr]", children: [_jsxs(motion.div, { className: "bg-card border-border shadow-card rounded-2xl border p-6 text-center lg:sticky lg:top-24 lg:h-fit", initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, children: [_jsx("div", { className: "bg-primary/10 text-primary mx-auto flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold", children: user.name.charAt(0).toUpperCase() }), _jsx("h2", { className: "text-foreground mt-4 text-lg font-semibold", children: user.name }), _jsx("p", { className: "text-muted-foreground text-sm", children: user.email }), _jsx("p", { className: "text-muted-foreground mt-2 text-xs capitalize", children: user.role.toLowerCase() }), _jsxs("p", { className: "text-muted-foreground mt-4 text-xs", children: ["Member since", ' ', new Date(user.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                            })] })] }), _jsxs(motion.div, { className: "bg-card border-border rounded-2xl border p-6", initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, children: [_jsx("h2", { className: "text-foreground mb-5 text-lg font-bold", children: "Edit Information" }), error && (_jsx(Alert, { variant: "danger", className: "mb-4", children: error })), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "flex flex-col gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-muted-foreground mb-1 block text-sm", children: "Email" }), _jsx(Input, { value: user.email, disabled: true })] }), _jsx(Input, { label: "Full Name", error: errors.name?.message, ...register('name') }), _jsx(Input, { label: "Phone", type: "tel", placeholder: "+1 234 567 890", error: errors.phone?.message, ...register('phone') }), _jsx(Input, { label: "Address", placeholder: "123 Main St, Apt 4", error: errors.address?.message, ...register('address') }), _jsx("div", { className: "mt-2", children: _jsx(Button, { type: "submit", disabled: saving || !isDirty, children: saving ? 'Saving…' : 'Save Changes' }) })] })] })] })] })] }));
}
