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

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      phone: user?.phone ?? '',
      address: user?.address ?? '',
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    setSaving(true);
    setError(null);
    try {
      await authService.updateProfile(data);
      await dispatch(fetchMe());
      toast.success('Profile updated!');
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? 'Update failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Helmet>
        <title>My Profile – AquaLuxe</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-10">
        <h1 className="text-foreground mb-8 text-2xl font-bold">My Profile</h1>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Left — avatar card */}
          <motion.div
            className="bg-card border-border shadow-card rounded-2xl border p-6 text-center lg:sticky lg:top-24 lg:h-fit"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-primary/10 text-primary mx-auto flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-foreground mt-4 text-lg font-semibold">{user.name}</h2>
            <p className="text-muted-foreground text-sm">{user.email}</p>
            <p className="text-muted-foreground mt-2 text-xs capitalize">
              {user.role.toLowerCase()}
            </p>
            <p className="text-muted-foreground mt-4 text-xs">
              Member since{' '}
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
              })}
            </p>
          </motion.div>

          {/* Right — form */}
          <motion.div
            className="bg-card border-border rounded-2xl border p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-foreground mb-5 text-lg font-bold">Edit Information</h2>

            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div>
                <label className="text-muted-foreground mb-1 block text-sm">Email</label>
                <Input value={user.email} disabled />
              </div>

              <Input label="Full Name" error={errors.name?.message} {...register('name')} />
              <Input
                label="Phone"
                type="tel"
                placeholder="+1 234 567 890"
                error={errors.phone?.message}
                {...register('phone')}
              />
              <Input
                label="Address"
                placeholder="123 Main St, Apt 4"
                error={errors.address?.message}
                {...register('address')}
              />

              <div className="mt-2">
                <Button type="submit" disabled={saving || !isDirty}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}
