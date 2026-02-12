import type { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { parsePagination } from '../utils/pagination.js';

export async function listSpecies(query: {
  page?: string;
  limit?: string;
  search?: string;
  waterType?: string;
  careLevel?: string;
}) {
  const { page, limit, skip } = parsePagination(query);

  const where: Prisma.FishSpeciesWhereInput = {};
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { scientificName: { contains: query.search, mode: 'insensitive' } },
    ];
  }
  if (query.waterType) where.waterType = query.waterType as any;
  if (query.careLevel) where.careLevel = query.careLevel as any;

  const [species, total] = await Promise.all([
    prisma.fishSpecies.findMany({
      where,
      include: { _count: { select: { products: true } }, images: { take: 1 } },
      skip,
      take: limit,
      orderBy: { name: 'asc' },
    }),
    prisma.fishSpecies.count({ where }),
  ]);

  return { species, total, page, limit };
}

export async function getSpeciesById(id: string) {
  return prisma.fishSpecies.findUniqueOrThrow({
    where: { id },
    include: { images: true, _count: { select: { products: true } } },
  });
}

export async function createSpecies(data: any) {
  return prisma.fishSpecies.create({ data });
}

export async function updateSpecies(id: string, data: any) {
  return prisma.fishSpecies.update({ where: { id }, data });
}
