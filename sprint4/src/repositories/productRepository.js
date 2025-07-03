import prisma from '../lib/prismaClient.js';

export async function save(product) {
  return prisma.product.create({
    data: {
      name: product.name,
      description: product.description,
      price: parseInt(product.price, 10),
      tags: product.tags,
      images: product.images,
      author: {
        connect: { id: product.authorId }, 
      },
    },
  });
}

export async function getById(id) {
  return prisma.product.findUnique({
    where: { id: parseInt(id, 10)},
     select: {
      id: true,
      name: true,
      description: true,
      price: true,
      authorId: true
     },
  });
}

export async function getAll() {
  return prisma.product.findMany({
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

export async function update(id, data) {
  return prisma.product.update({
    where: { id: parseInt(id, 10) },
    data,
  });
}

export async function deleteById(id) {
  return prisma.product.delete({
    where: { id: parseInt(id, 10) },
  });
}

export async function findByAuthorId(userId) {
  return prisma.product.findMany({
    where: { authorId: userId },
  });
}

export async function createComment(comment) {
  return prisma.comment.create({
    data: {
      content: comment.content,
      product: { connect: { id: comment.productId } },
      author: { connect: { id: comment.authorId } },
    },
  });
}

export async function getComments(productId, cursor, limit) {
  return prisma.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { productId },
    orderBy: { createdAt: 'desc' },
  });
}

export const productRepository= {
  save,
  getById,
  getAll,
  update,
  deleteById,
  findByAuthorId,
  createComment,
  getComments
};
