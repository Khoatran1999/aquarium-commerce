import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { generateToken } from '../middleware/auth.js';
import { ApiError } from '../utils/api-error.js';

export async function register(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw ApiError.conflict('Email already in use');

  const hashedPassword = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: { ...data, password: hashedPassword },
    select: { id: true, name: true, email: true, role: true, avatar: true, createdAt: true },
  });

  const token = generateToken({ userId: user.id, email: user.email, role: user.role });
  return { user, token };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw ApiError.unauthorized('Invalid email or password');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw ApiError.unauthorized('Invalid email or password');

  const token = generateToken({ userId: user.id, email: user.email, role: user.role });
  const { password: _, ...safeUser } = user;
  return { user: safeUser, token };
}

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      phone: true,
      address: true,
      createdAt: true,
    },
  });
  if (!user) throw ApiError.notFound('User not found');
  return user;
}

export async function updateProfile(
  userId: string,
  data: { name?: string; phone?: string; address?: string; avatar?: string },
) {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      phone: true,
      address: true,
    },
  });
}
