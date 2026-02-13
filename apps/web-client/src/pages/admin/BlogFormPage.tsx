import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Save, Eye, EyeOff, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '@repo/services';
import type { BlogStatus } from '@repo/types';
import { useCreateBlog, useUpdateBlog } from '../../hooks/useBlogs';
import RichTextEditor from '../../components/admin/RichTextEditor';

/* ── Validation schema ─────────────────────── */
const blogFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(200),
  excerpt: z.string().max(500).optional(),
  coverImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function BlogFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [slugManual, setSlugManual] = useState(false);

  /* ── Fetch existing blog for edit ────────── */
  const { data: existingBlog } = useQuery({
    queryKey: ['admin', 'blogs', id],
    queryFn: async () => {
      const res = await adminService.getBlogs({ search: id, limit: 100 });
      return res.data.find((b: { id: string }) => b.id === id) ?? null;
    },
    enabled: isEdit,
  });

  /* ── Form ────────────────────────────────── */
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      coverImage: '',
      status: 'DRAFT',
    },
  });

  const titleValue = watch('title');

  // Auto-generate slug from title (only when not manually edited)
  useEffect(() => {
    if (!slugManual && !isEdit) {
      setValue('slug', slugify(titleValue ?? ''));
    }
  }, [titleValue, slugManual, isEdit, setValue]);

  // Populate form for edit
  useEffect(() => {
    if (isEdit && existingBlog) {
      reset({
        title: existingBlog.title,
        slug: existingBlog.slug,
        excerpt: existingBlog.excerpt ?? '',
        coverImage: existingBlog.coverImage ?? '',
        status: existingBlog.status,
      });
      setContent(existingBlog.content);
      setTags(existingBlog.tags ?? []);
      setSlugManual(true);
    }
  }, [isEdit, existingBlog, reset]);

  /* ── Mutations ───────────────────────────── */
  const createMutation = useCreateBlog();
  const updateMutation = useUpdateBlog();

  const onSubmit = (values: BlogFormValues) => {
    const payload = {
      ...values,
      content,
      tags,
      coverImage: values.coverImage || undefined,
      excerpt: values.excerpt || undefined,
    };

    if (isEdit) {
      updateMutation.mutate(
        { id: id!, payload },
        {
          onSuccess: () => {
            toast.success('Blog updated!');
            navigate('/admin/blogs');
          },
          onError: () => toast.error('Failed to update blog'),
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Blog created!');
          navigate('/admin/blogs');
        },
        onError: () => toast.error('Failed to create blog'),
      });
    }
  };

  /* ── Tag management ──────────────────────── */
  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags((prev) => [...prev, tag]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const currentStatus = watch('status') as BlogStatus;

  const fieldClass =
    'bg-card border-border text-foreground w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30';
  const labelClass = 'text-foreground mb-1 block text-sm font-medium';
  const errorClass = 'text-danger mt-0.5 text-xs';

  const coverImage = watch('coverImage');

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/blogs')}
          className="hover:bg-muted rounded-lg p-2 transition-colors"
        >
          <ArrowLeft className="text-muted-foreground h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-foreground text-2xl font-bold">
            {isEdit ? 'Edit Blog Post' : 'New Blog Post'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isEdit ? 'Update your blog post' : 'Write a new blog post'}
          </p>
        </div>
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          {currentStatus === 'PUBLISHED' ? (
            <span className="bg-success/10 text-success inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold">
              <Eye className="h-3 w-3" /> Published
            </span>
          ) : currentStatus === 'ARCHIVED' ? (
            <span className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold">
              <EyeOff className="h-3 w-3" /> Archived
            </span>
          ) : (
            <span className="bg-warning/10 text-warning inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold">
              <EyeOff className="h-3 w-3" /> Draft
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-card border-border rounded-xl border p-5">
          <h2 className="text-foreground mb-4 font-semibold">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Title *</label>
              <input
                {...register('title')}
                className={fieldClass}
                placeholder="Enter blog title..."
              />
              {errors.title && <p className={errorClass}>{errors.title.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Slug *</label>
              <input
                {...register('slug')}
                className={fieldClass}
                placeholder="auto-generated-from-title"
                onFocus={() => setSlugManual(true)}
              />
              {errors.slug && <p className={errorClass}>{errors.slug.message}</p>}
              <p className="text-muted-foreground mt-0.5 text-xs">
                URL-friendly identifier. Auto-generated from title.
              </p>
            </div>
            <div>
              <label className={labelClass}>Excerpt</label>
              <textarea
                {...register('excerpt')}
                rows={2}
                className={fieldClass}
                placeholder="A brief summary of the post (shown in previews)..."
              />
            </div>
          </div>
        </div>

        {/* Content — Rich Text Editor */}
        <div className="bg-card border-border rounded-xl border p-5">
          <h2 className="text-foreground mb-4 font-semibold">Content *</h2>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Write your blog content here..."
          />
          {!content && (
            <p className="text-muted-foreground mt-1 text-xs">
              Use the toolbar above to format your content.
            </p>
          )}
        </div>

        {/* Cover Image */}
        <div className="bg-card border-border rounded-xl border p-5">
          <h2 className="text-foreground mb-4 font-semibold">Cover Image</h2>
          <input
            {...register('coverImage')}
            className={fieldClass}
            placeholder="https://example.com/image.jpg"
          />
          {errors.coverImage && <p className={errorClass}>{errors.coverImage.message}</p>}
          {coverImage && (
            <div className="mt-3">
              <img
                src={coverImage}
                alt="Cover preview"
                className="h-48 w-full rounded-lg object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="bg-card border-border rounded-xl border p-5">
          <h2 className="text-foreground mb-4 font-semibold">Tags</h2>
          <div className="mb-3 flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag..."
              className={`flex-1 ${fieldClass}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <button
              type="button"
              onClick={addTag}
              className="bg-primary rounded-lg px-3 py-2 text-sm font-medium text-white"
            >
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Status & Actions */}
        <div className="bg-card border-border rounded-xl border p-5">
          <h2 className="text-foreground mb-4 font-semibold">Publishing</h2>
          <div className="mb-4">
            <label className={labelClass}>Status</label>
            <select {...register('status')} className={fieldClass}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/blogs')}
            className="border-border text-foreground hover:bg-muted rounded-lg border px-4 py-2.5 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="bg-primary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
