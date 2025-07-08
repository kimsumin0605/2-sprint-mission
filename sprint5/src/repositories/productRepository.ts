import { Prisma } from '@prisma/client';
import prisma from '../lib/prismaClient';
import { CreateProductInput } from '../types/product';
import { CreateCommentInput } from '../types/comment';

export async function save(product: CreateProductInput) {
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

export async function deleteById(id: number) {
  return prisma.product.delete({
    where: { id },
  });
}

export async function findByAuthorId(userId: number) {
  return prisma.product.findMany({
    where: { authorId: userId },
  });
}

export async function createComment(comment: CreateCommentInput) {
  return prisma.comment.create({
    data: {
      content: comment.content,
      author: { connect: { id: comment.authorId } },
      ...(comment.productId && {
        product: { connect: { id: comment.productId } },
      }),
    },
  });
}

export async function getComments(productId: number, cursor?: number, limit?: number | undefined) {
  return prisma.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit ? + 1 : undefined,
    where: { productId },
    orderBy: { createdAt: 'desc' },
  });
}

export const productRepository = {
  save,
  getById,
  getAll,
  update,
  deleteById,
  findByAuthorId,
  createComment,
  getComments
};
