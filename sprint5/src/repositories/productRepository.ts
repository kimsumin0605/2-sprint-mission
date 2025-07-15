import { Prisma } from '@prisma/client';
import prisma from '../lib/prismaClient';
import { CreateProductInput } from '../types/product';

export async function createProduct(product: CreateProductInput) {
  return prisma.product.create({
    data: {
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      images: product.images,
      author: {
        connect: { id: product.authorId },
      },
    },
  });
}

export async function getById(id: number) {
  return prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      authorId: true
    },
  });
}

export async function getAll({ skip = 0, take = 10, }: { skip?: number; take?: number }) {
  return prisma.product.findMany({
    skip,
    take,
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      authorId: true
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function update(id: number, data: Prisma.ProductUpdateInput) {
  return prisma.product.update({
    where: { id },
    data,
  });
}

export async function deleteProduct(id: number) {
  return prisma.product.delete({
    where: { id },
  });
}

export async function findByAuthorId(userId: number) {
  return prisma.product.findMany({
    where: { authorId: userId },
  });
}

export const productRepository = {
  createProduct,
  getById,
  getAll,
  update,
  deleteProduct,
  findByAuthorId,
};
