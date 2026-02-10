import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@repo/services';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Pencil, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import type { FishSpecies } from '@repo/types';
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

type SpeciesFormValues = z.infer<typeof speciesSchema>;

export default function SpeciesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'species', { page, search }],
    queryFn: () => adminService.getSpecies({ page, limit: 10, search: search || undefined }),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SpeciesFormValues>({
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
    mutationFn: (data: Record<string, unknown>) => adminService.createSpecies(data),
    onSuccess: () => {
      toast.success('Species created!');
      queryClient.invalidateQueries({ queryKey: ['admin', 'species'] });
      closeForm();
    },
    onError: () => toast.error('Failed to create species'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      adminService.updateSpecies(id, data),
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

  const openEdit = (species: FishSpecies) => {
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

  const onSubmit = (values: SpeciesFormValues) => {
    const payload = values as Record<string, unknown>;
    if (editId) {
      updateMutation.mutate({ id: editId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const species: FishSpecies[] = data?.data ?? [];
  const meta = data?.meta;
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const CARE_COLORS: Record<string, string> = {
    EASY: 'bg-success/10 text-success',
    MODERATE: 'bg-warning/10 text-warning',
    HARD: 'bg-secondary/10 text-secondary',
    EXPERT: 'bg-danger/10 text-danger',
  };

  const columns = [
    {
      key: 'name',
      label: 'Species',
      render: (s: FishSpecies) => (
        <div>
          <p className="text-foreground font-medium">{s.name}</p>
          <p className="text-muted-foreground text-xs italic">{s.scientificName}</p>
        </div>
      ),
    },
    {
      key: 'waterType',
      label: 'Water',
      render: (s: FishSpecies) => (
        <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
          {s.waterType}
        </span>
      ),
    },
    {
      key: 'careLevel',
      label: 'Care',
      render: (s: FishSpecies) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${CARE_COLORS[s.careLevel] ?? 'bg-muted text-muted-foreground'}`}
        >
          {s.careLevel}
        </span>
      ),
    },
    {
      key: 'temperament',
      label: 'Temperament',
      render: (s: FishSpecies) => (
        <span className="text-foreground text-sm capitalize">
          {s.temperament.replace('_', ' ').toLowerCase()}
        </span>
      ),
    },
    {
      key: 'origin',
      label: 'Origin',
      render: (s: FishSpecies) => (
        <span className="text-muted-foreground text-xs">{s.origin ?? '—'}</span>
      ),
    },
    {
      key: 'actions',
      label: '',
      className: 'w-12',
      render: (s: FishSpecies) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            openEdit(s);
          }}
          className="hover:bg-muted rounded-lg p-1.5 transition-colors"
        >
          <Pencil className="text-muted-foreground h-4 w-4" />
        </button>
      ),
    },
  ];

  const fieldClass =
    'bg-card border-border text-foreground w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30';

  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Fish Species</h1>
          <p className="text-muted-foreground text-sm">{meta?.total ?? 0} species cataloged</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-primary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Species
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search species..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className={`pl-9 pr-4 ${fieldClass}`}
        />
      </div>

      <DataTable
        columns={columns}
        data={species}
        page={page}
        totalPages={meta?.totalPages ?? 1}
        total={meta?.total ?? 0}
        loading={isLoading}
        onPageChange={setPage}
        onRowClick={openEdit}
        getRowKey={(s) => s.id}
        emptyMessage="No species found"
      />

      {/* Species Form Dialog */}
      <AnimatePresence>
        {formOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-auto"
            onClick={closeForm}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border-border relative z-10 mx-4 my-8 w-full max-w-lg rounded-xl border p-6 shadow-lg"
            >
              <button onClick={closeForm} className="text-muted-foreground absolute right-3 top-3">
                <X className="h-4 w-4" />
              </button>
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                {editId ? 'Edit Species' : 'New Species'}
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-foreground mb-1 block text-xs font-medium">Name *</label>
                    <input {...register('name')} className={fieldClass} />
                    {errors.name && (
                      <p className="text-danger mt-0.5 text-xs">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-foreground mb-1 block text-xs font-medium">
                      Scientific Name *
                    </label>
                    <input {...register('scientificName')} className={fieldClass} />
                    {errors.scientificName && (
                      <p className="text-danger mt-0.5 text-xs">{errors.scientificName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-foreground mb-1 block text-xs font-medium">
                    Description
                  </label>
                  <textarea {...register('description')} rows={2} className={fieldClass} />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-foreground mb-1 block text-xs font-medium">
                      Care Level
                    </label>
                    <select {...register('careLevel')} className={fieldClass}>
                      {['EASY', 'MODERATE', 'HARD', 'EXPERT'].map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-foreground mb-1 block text-xs font-medium">
                      Temperament
                    </label>
                    <select {...register('temperament')} className={fieldClass}>
                      {['PEACEFUL', 'SEMI_AGGRESSIVE', 'AGGRESSIVE'].map((v) => (
                        <option key={v} value={v}>
                          {v.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-foreground mb-1 block text-xs font-medium">
                      Water Type
                    </label>
                    <select {...register('waterType')} className={fieldClass}>
                      {['FRESHWATER', 'SALTWATER', 'BRACKISH'].map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-foreground mb-1 block text-xs font-medium">
                      Min Tank (gal)
                    </label>
                    <input {...register('minTankSize')} type="number" className={fieldClass} />
                  </div>
                  <div>
                    <label className="text-foreground mb-1 block text-xs font-medium">
                      Min Temp (°F)
                    </label>
                    <input
                      {...register('minTemp')}
                      type="number"
                      step="0.1"
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className="text-foreground mb-1 block text-xs font-medium">
                      Max Temp (°F)
                    </label>
                    <input
                      {...register('maxTemp')}
                      type="number"
                      step="0.1"
                      className={fieldClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-foreground mb-1 block text-xs font-medium">Min pH</label>
                    <input {...register('minPh')} type="number" step="0.1" className={fieldClass} />
                  </div>
                  <div>
                    <label className="text-foreground mb-1 block text-xs font-medium">Max pH</label>
                    <input {...register('maxPh')} type="number" step="0.1" className={fieldClass} />
                  </div>
                  <div>
                    <label className="text-foreground mb-1 block text-xs font-medium">
                      Max Size (in)
                    </label>
                    <input
                      {...register('maxSize')}
                      type="number"
                      step="0.1"
                      className={fieldClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-foreground mb-1 block text-xs font-medium">
                      Lifespan
                    </label>
                    <input
                      {...register('lifespan')}
                      className={fieldClass}
                      placeholder="e.g. 5-8 years"
                    />
                  </div>
                  <div>
                    <label className="text-foreground mb-1 block text-xs font-medium">Diet</label>
                    <input
                      {...register('diet')}
                      className={fieldClass}
                      placeholder="e.g. Omnivore"
                    />
                  </div>
                  <div>
                    <label className="text-foreground mb-1 block text-xs font-medium">Origin</label>
                    <input
                      {...register('origin')}
                      className={fieldClass}
                      placeholder="e.g. Amazon"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="border-border text-foreground hover:bg-muted rounded-lg border px-4 py-2 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-primary rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : editId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
