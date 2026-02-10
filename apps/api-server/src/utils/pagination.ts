export function parsePagination(query: { page?: string; limit?: string }) {
  const rawPage = parseInt(query.page || '1', 10);
  const rawLimit = parseInt(query.limit || '12', 10);
  const page = Math.max(1, Number.isNaN(rawPage) ? 1 : rawPage);
  const limit = Math.min(100, Math.max(1, Number.isNaN(rawLimit) ? 12 : rawLimit));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
