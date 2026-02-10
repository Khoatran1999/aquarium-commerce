import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { adminService } from '@repo/services';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
const productSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    description: z.string().optional(),
    price: z.coerce.number().min(0, 'Price must be >= 0'),
    compareAtPrice: z.coerce.number().optional().nullable(),
    speciesId: z.string().min(1, 'Species is required'),
    size: z.enum(['XS', 'S', 'M', 'L', 'XL']),
    age: z.string().optional(),
    gender: z.string().optional(),
    available: z.coerce.number().int().min(0),
    images: z
        .array(z.object({ url: z.string().url(), alt: z.string().optional(), isPrimary: z.boolean() }))
        .optional(),
});
export default function ProductFormPage() {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [imageUrl, setImageUrl] = useState('');
    const [images, setImages] = useState([]);
    // Fetch species for dropdown
    const { data: speciesData } = useQuery({
        queryKey: ['admin', 'species-all'],
        queryFn: () => adminService.getSpecies({ limit: 100 }),
    });
    // Fetch existing product (edit mode)
    const { data: existingProduct } = useQuery({
        queryKey: ['admin', 'product', id],
        queryFn: () => adminService.getProducts({ search: id }),
        enabled: isEdit,
    });
    const { register, handleSubmit, reset, formState: { errors }, } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            speciesId: '',
            size: 'M',
            age: '',
            gender: '',
            available: 0,
        },
    });
    // Populate form in edit mode
    useEffect(() => {
        if (isEdit && existingProduct?.data) {
            const product = existingProduct.data.find((p) => p.id === id);
            if (product) {
                reset({
                    name: product.name,
                    description: product.description ?? '',
                    price: product.price,
                    compareAtPrice: product.comparePrice ?? undefined,
                    speciesId: product.speciesId,
                    size: product.size,
                    age: product.age ?? '',
                    gender: product.gender ?? '',
                    available: product.available,
                });
                if (product.images) {
                    setImages(product.images.map((img) => ({
                        url: img.url,
                        alt: img.alt ?? '',
                        isPrimary: img.isPrimary,
                    })));
                }
            }
        }
    }, [isEdit, existingProduct, id, reset]);
    const createMutation = useMutation({
        mutationFn: (data) => adminService.createProduct(data),
        onSuccess: () => {
            toast.success('Product created!');
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
            navigate('/products');
        },
        onError: () => toast.error('Failed to create product'),
    });
    const updateMutation = useMutation({
        mutationFn: (data) => adminService.updateProduct(id, data),
        onSuccess: () => {
            toast.success('Product updated!');
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
            navigate('/products');
        },
        onError: () => toast.error('Failed to update product'),
    });
    const onSubmit = (values) => {
        const payload = { ...values, images };
        if (isEdit) {
            updateMutation.mutate(payload);
        }
        else {
            createMutation.mutate(payload);
        }
    };
    const addImage = () => {
        if (!imageUrl.trim())
            return;
        setImages((prev) => [...prev, { url: imageUrl.trim(), alt: '', isPrimary: prev.length === 0 }]);
        setImageUrl('');
    };
    const removeImage = (index) => {
        setImages((prev) => {
            const next = prev.filter((_, i) => i !== index);
            if (next.length > 0 && !next.some((img) => img.isPrimary)) {
                next[0].isPrimary = true;
            }
            return next;
        });
    };
    const setPrimary = (index) => {
        setImages((prev) => prev.map((img, i) => ({ ...img, isPrimary: i === index })));
    };
    const isSaving = createMutation.isPending || updateMutation.isPending;
    const speciesList = speciesData?.data ?? [];
    const fieldClass = 'bg-card border-border text-foreground w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30';
    const labelClass = 'text-foreground mb-1 block text-sm font-medium';
    const errorClass = 'text-danger mt-0.5 text-xs';
    return (_jsxs("div", { className: "mx-auto max-w-3xl space-y-6 p-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: () => navigate('/products'), className: "hover:bg-muted rounded-lg p-2 transition-colors", children: _jsx(ArrowLeft, { className: "text-muted-foreground h-5 w-5" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-foreground text-2xl font-bold", children: isEdit ? 'Edit Product' : 'New Product' }), _jsx("p", { className: "text-muted-foreground text-sm", children: isEdit ? 'Update product information' : 'Add a new product to your store' })] })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [_jsxs("div", { className: "bg-card border-border rounded-xl border p-5", children: [_jsx("h2", { className: "text-foreground mb-4 font-semibold", children: "Basic Information" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Name *" }), _jsx("input", { ...register('name'), className: fieldClass, placeholder: "e.g. Nemo Clownfish" }), errors.name && _jsx("p", { className: errorClass, children: errors.name.message })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Description" }), _jsx("textarea", { ...register('description'), rows: 4, className: fieldClass, placeholder: "Describe the fish..." })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Species *" }), _jsxs("select", { ...register('speciesId'), className: fieldClass, children: [_jsx("option", { value: "", children: "Select species" }), speciesList.map((s) => (_jsx("option", { value: s.id, children: s.name }, s.id)))] }), errors.speciesId && _jsx("p", { className: errorClass, children: errors.speciesId.message })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Size *" }), _jsx("select", { ...register('size'), className: fieldClass, children: ['XS', 'S', 'M', 'L', 'XL'].map((s) => (_jsx("option", { value: s, children: s }, s))) })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Age" }), _jsx("input", { ...register('age'), className: fieldClass, placeholder: "e.g. 6 months" })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Gender" }), _jsx("input", { ...register('gender'), className: fieldClass, placeholder: "e.g. Male" })] })] })] })] }), _jsxs("div", { className: "bg-card border-border rounded-xl border p-5", children: [_jsx("h2", { className: "text-foreground mb-4 font-semibold", children: "Pricing & Stock" }), _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Price ($) *" }), _jsx("input", { ...register('price'), type: "number", step: "0.01", className: fieldClass }), errors.price && _jsx("p", { className: errorClass, children: errors.price.message })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Compare At Price ($)" }), _jsx("input", { ...register('compareAtPrice'), type: "number", step: "0.01", className: fieldClass })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Available Stock" }), _jsx("input", { ...register('available'), type: "number", className: fieldClass })] })] })] }), _jsxs("div", { className: "bg-card border-border rounded-xl border p-5", children: [_jsx("h2", { className: "text-foreground mb-4 font-semibold", children: "Images" }), _jsxs("div", { className: "mb-3 flex gap-2", children: [_jsx("input", { type: "text", value: imageUrl, onChange: (e) => setImageUrl(e.target.value), placeholder: "Enter image URL...", className: `flex-1 ${fieldClass}`, onKeyDown: (e) => e.key === 'Enter' && (e.preventDefault(), addImage()) }), _jsxs("button", { type: "button", onClick: addImage, className: "bg-primary flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white", children: [_jsx(Plus, { className: "h-4 w-4" }), "Add"] })] }), images.length > 0 && (_jsx("div", { className: "grid grid-cols-4 gap-3", children: images.map((img, i) => (_jsxs("div", { className: `border-border group relative overflow-hidden rounded-lg border ${img.isPrimary ? 'ring-primary ring-2' : ''}`, children: [_jsx("img", { src: img.url, alt: img.alt, className: "aspect-square w-full object-cover" }), _jsxs("div", { className: "absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100", children: [_jsx("button", { type: "button", onClick: () => setPrimary(i), className: "rounded bg-white/20 px-2 py-1 text-xs text-white", children: img.isPrimary ? 'Primary' : 'Set Primary' }), _jsx("button", { type: "button", onClick: () => removeImage(i), className: "rounded bg-red-500/80 p-1 text-white", children: _jsx(X, { className: "h-3 w-3" }) })] })] }, i))) }))] }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx("button", { type: "button", onClick: () => navigate('/products'), className: "border-border text-foreground hover:bg-muted rounded-lg border px-4 py-2.5 text-sm font-medium", children: "Cancel" }), _jsxs("button", { type: "submit", disabled: isSaving, className: "bg-primary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50", children: [_jsx(Save, { className: "h-4 w-4" }), isSaving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'] })] })] })] }));
}
