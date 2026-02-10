import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@repo/services';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Pencil, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import DataTable from '../components/DataTable';
const speciesSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    scientificName: z.string().min(2, 'Scientific name is required'),
    description: z.string().optional(),
    careLevel: z.enum(['EASY', 'MODERATE', 'HARD', 'EXPERT']),
    temperament: z.enum(['PEACEFUL', 'SEMI_AGGRESSIVE', 'AGGRESSIVE']),
    waterType: z.enum(['FRESHWATER', 'SALTWATER', 'BRACKISH']),
    minTankSize: z.coerce.number().optional().nullable(),
    minTemp: z.coerce.number().optional().nullable(),
    maxTemp: z.coerce.number().optional().nullable(),
    minPh: z.coerce.number().optional().nullable(),
    maxPh: z.coerce.number().optional().nullable(),
    maxSize: z.coerce.number().optional().nullable(),
    lifespan: z.string().optional().nullable(),
    diet: z.string().optional().nullable(),
    origin: z.string().optional().nullable(),
});
export default function SpeciesPage() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [formOpen, setFormOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'species', { page, search }],
        queryFn: () => adminService.getSpecies({ page, limit: 10, search: search || undefined }),
    });
    const { register, handleSubmit, reset, formState: { errors }, } = useForm({
        resolver: zodResolver(speciesSchema),
        defaultValues: {
            name: '',
            scientificName: '',
            careLevel: 'EASY',
            temperament: 'PEACEFUL',
            waterType: 'FRESHWATER',
        },
    });
    const createMutation = useMutation({
        mutationFn: (data) => adminService.createSpecies(data),
        onSuccess: () => {
            toast.success('Species created!');
            queryClient.invalidateQueries({ queryKey: ['admin', 'species'] });
            closeForm();
        },
        onError: () => toast.error('Failed to create species'),
    });
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => adminService.updateSpecies(id, data),
        onSuccess: () => {
            toast.success('Species updated!');
            queryClient.invalidateQueries({ queryKey: ['admin', 'species'] });
            closeForm();
        },
        onError: () => toast.error('Failed to update species'),
    });
    const openCreate = () => {
        setEditId(null);
        reset({
            name: '',
            scientificName: '',
            description: '',
            careLevel: 'EASY',
            temperament: 'PEACEFUL',
            waterType: 'FRESHWATER',
            minTankSize: null,
            minTemp: null,
            maxTemp: null,
            minPh: null,
            maxPh: null,
            maxSize: null,
            lifespan: '',
            diet: '',
            origin: '',
        });
        setFormOpen(true);
    };
    const openEdit = (species) => {
        setEditId(species.id);
        reset({
            name: species.name,
            scientificName: species.scientificName,
            description: species.description ?? '',
            careLevel: species.careLevel,
            temperament: species.temperament,
            waterType: species.waterType,
            minTankSize: species.minTankSize ?? null,
            minTemp: species.minTemp ?? null,
            maxTemp: species.maxTemp ?? null,
            minPh: species.minPh ?? null,
            maxPh: species.maxPh ?? null,
            maxSize: species.maxSize ?? null,
            lifespan: species.lifespan ?? '',
            diet: species.diet ?? '',
            origin: species.origin ?? '',
        });
        setFormOpen(true);
    };
    const closeForm = () => {
        setFormOpen(false);
        setEditId(null);
    };
    const onSubmit = (values) => {
        const payload = values;
        if (editId) {
            updateMutation.mutate({ id: editId, data: payload });
        }
        else {
            createMutation.mutate(payload);
        }
    };
    const species = data?.data ?? [];
    const meta = data?.meta;
    const isSaving = createMutation.isPending || updateMutation.isPending;
    const CARE_COLORS = {
        EASY: 'bg-success/10 text-success',
        MODERATE: 'bg-warning/10 text-warning',
        HARD: 'bg-secondary/10 text-secondary',
        EXPERT: 'bg-danger/10 text-danger',
    };
    const columns = [
        {
            key: 'name',
            label: 'Species',
            render: (s) => (_jsxs("div", { children: [_jsx("p", { className: "text-foreground font-medium", children: s.name }), _jsx("p", { className: "text-muted-foreground text-xs italic", children: s.scientificName })] })),
        },
        {
            key: 'waterType',
            label: 'Water',
            render: (s) => (_jsx("span", { className: "bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium", children: s.waterType })),
        },
        {
            key: 'careLevel',
            label: 'Care',
            render: (s) => (_jsx("span", { className: `rounded-full px-2 py-0.5 text-xs font-semibold ${CARE_COLORS[s.careLevel] ?? 'bg-muted text-muted-foreground'}`, children: s.careLevel })),
        },
        {
            key: 'temperament',
            label: 'Temperament',
            render: (s) => (_jsx("span", { className: "text-foreground text-sm capitalize", children: s.temperament.replace('_', ' ').toLowerCase() })),
        },
        {
            key: 'origin',
            label: 'Origin',
            render: (s) => (_jsx("span", { className: "text-muted-foreground text-xs", children: s.origin ?? '—' })),
        },
        {
            key: 'actions',
            label: '',
            className: 'w-12',
            render: (s) => (_jsx("button", { onClick: (e) => {
                    e.stopPropagation();
                    openEdit(s);
                }, className: "hover:bg-muted rounded-lg p-1.5 transition-colors", children: _jsx(Pencil, { className: "text-muted-foreground h-4 w-4" }) })),
        },
    ];
    const fieldClass = 'bg-card border-border text-foreground w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30';
    return (_jsxs("div", { className: "space-y-4 p-6", children: [_jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-foreground text-2xl font-bold", children: "Fish Species" }), _jsxs("p", { className: "text-muted-foreground text-sm", children: [meta?.total ?? 0, " species cataloged"] })] }), _jsxs("button", { onClick: openCreate, className: "bg-primary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white hover:opacity-90", children: [_jsx(Plus, { className: "h-4 w-4" }), "Add Species"] })] }), _jsxs("div", { className: "relative max-w-sm", children: [_jsx(Search, { className: "text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" }), _jsx("input", { type: "text", placeholder: "Search species...", value: search, onChange: (e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }, className: `pl-9 pr-4 ${fieldClass}` })] }), _jsx(DataTable, { columns: columns, data: species, page: page, totalPages: meta?.totalPages ?? 1, total: meta?.total ?? 0, loading: isLoading, onPageChange: setPage, onRowClick: openEdit, getRowKey: (s) => s.id, emptyMessage: "No species found" }), _jsx(AnimatePresence, { children: formOpen && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center overflow-auto", onClick: closeForm, children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 0.4 }, exit: { opacity: 0 }, className: "absolute inset-0 bg-black" }), _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95, y: 10 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: 10 }, transition: { duration: 0.15 }, onClick: (e) => e.stopPropagation(), className: "bg-card border-border relative z-10 mx-4 my-8 w-full max-w-lg rounded-xl border p-6 shadow-lg", children: [_jsx("button", { onClick: closeForm, className: "text-muted-foreground absolute right-3 top-3", children: _jsx(X, { className: "h-4 w-4" }) }), _jsx("h3", { className: "text-foreground mb-4 text-lg font-semibold", children: editId ? 'Edit Species' : 'New Species' }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-3", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-foreground mb-1 block text-xs font-medium", children: "Name *" }), _jsx("input", { ...register('name'), className: fieldClass }), errors.name && (_jsx("p", { className: "text-danger mt-0.5 text-xs", children: errors.name.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "text-foreground mb-1 block text-xs font-medium", children: "Scientific Name *" }), _jsx("input", { ...register('scientificName'), className: fieldClass }), errors.scientificName && (_jsx("p", { className: "text-danger mt-0.5 text-xs", children: errors.scientificName.message }))] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-foreground mb-1 block text-xs font-medium", children: "Description" }), _jsx("textarea", { ...register('description'), rows: 2, className: fieldClass })] }), _jsxs("div", { className: "grid grid-cols-3 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-foreground mb-1 block text-xs font-medium", children: "Care Level" }), _jsx("select", { ...register('careLevel'), className: fieldClass, children: ['EASY', 'MODERATE', 'HARD', 'EXPERT'].map((v) => (_jsx("option", { value: v, children: v }, v))) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-foreground mb-1 block text-xs font-medium", children: "Temperament" }), _jsx("select", { ...register('temperament'), className: fieldClass, children: ['PEACEFUL', 'SEMI_AGGRESSIVE', 'AGGRESSIVE'].map((v) => (_jsx("option", { value: v, children: v.replace('_', ' ') }, v))) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-foreground mb-1 block text-xs font-medium", children: "Water Type" }), _jsx("select", { ...register('waterType'), className: fieldClass, children: ['FRESHWATER', 'SALTWATER', 'BRACKISH'].map((v) => (_jsx("option", { value: v, children: v }, v))) })] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-foreground mb-1 block text-xs font-medium", children: "Min Tank (gal)" }), _jsx("input", { ...register('minTankSize'), type: "number", className: fieldClass })] }), _jsxs("div", { children: [_jsx("label", { className: "text-foreground mb-1 block text-xs font-medium", children: "Min Temp (\u00B0F)" }), _jsx("input", { ...register('minTemp'), type: "number", step: "0.1", className: fieldClass })] }), _jsxs("div", { children: [_jsx("label", { className: "text-foreground mb-1 block text-xs font-medium", children: "Max Temp (\u00B0F)" }), _jsx("input", { ...register('maxTemp'), type: "number", step: "0.1", className: fieldClass })] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-foreground mb-1 block text-xs font-medium", children: "Min pH" }), _jsx("input", { ...register('minPh'), type: "number", step: "0.1", className: fieldClass })] }), _jsxs("div", { children: [_jsx("label", { className: "text-foreground mb-1 block text-xs font-medium", children: "Max pH" }), _jsx("input", { ...register('maxPh'), type: "number", step: "0.1", className: fieldClass })] }), _jsxs("div", { children: [_jsx("label", { className: "text-foreground mb-1 block text-xs font-medium", children: "Max Size (in)" }), _jsx("input", { ...register('maxSize'), type: "number", step: "0.1", className: fieldClass })] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-foreground mb-1 block text-xs font-medium", children: "Lifespan" }), _jsx("input", { ...register('lifespan'), className: fieldClass, placeholder: "e.g. 5-8 years" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-foreground mb-1 block text-xs font-medium", children: "Diet" }), _jsx("input", { ...register('diet'), className: fieldClass, placeholder: "e.g. Omnivore" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-foreground mb-1 block text-xs font-medium", children: "Origin" }), _jsx("input", { ...register('origin'), className: fieldClass, placeholder: "e.g. Amazon" })] })] }), _jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [_jsx("button", { type: "button", onClick: closeForm, className: "border-border text-foreground hover:bg-muted rounded-lg border px-4 py-2 text-sm font-medium", children: "Cancel" }), _jsx("button", { type: "submit", disabled: isSaving, className: "bg-primary rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50", children: isSaving ? 'Saving...' : editId ? 'Update' : 'Create' })] })] })] })] })) })] }));
}
