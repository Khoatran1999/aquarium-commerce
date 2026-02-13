import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { blogService, adminService } from '@repo/services';
import type { BlogFilter, BlogStatus, CreateBlogPayload, UpdateBlogPayload } from '@repo/types';
import { queryKeys } from './queryKeys';

/** Paginated published blog list */
export function useBlogs(filter?: BlogFilter) {
  return useQuery({
    queryKey: queryKeys.blogs.list(filter as Record<string, unknown>),
    queryFn: () => blogService.getBlogs(filter),
    placeholderData: keepPreviousData,
  });
}

/** Single blog post by slug */
export function useBlog(slug: string) {
  return useQuery({
    queryKey: queryKeys.blogs.detail(slug),
    queryFn: () => blogService.getBlogBySlug(slug),
    enabled: !!slug,
  });
}

/* ── Admin Mutations ─────────────────────────── */

export function useAdminBlogs(params?: {
  page?: number;
  limit?: number;
  status?: BlogStatus;
  search?: string;
}) {
  return useQuery({
    queryKey: ['admin', 'blogs', params],
    queryFn: () => adminService.getBlogs(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBlogPayload) => adminService.createBlog(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'blogs'] }),
  });
}

export function useUpdateBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBlogPayload }) =>
      adminService.updateBlog(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'blogs'] }),
  });
}

export function useDeleteBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteBlog(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'blogs'] }),
  });
}

export function useUpdateBlogStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BlogStatus }) =>
      adminService.updateBlogStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'blogs'] }),
  });
}
