import prisma from '../lib/prismaClient';
import { CreateCommentInput } from '../types/comment';

export async function ProductComment(input: CreateCommentInput) {
  return prisma.comment.create({
    data: {
      content: input.content,
      author: { connect: { id: input.authorId } },
      product: { connect: { id: input.productId! } }, 
    },
  });
}

export async function ArticleComment(input: CreateCommentInput) {
  return prisma.comment.create({
    data: {
      content: input.content,
      author: { connect: { id: input.authorId } },
      article: { connect: { id: input.articleId! } }, 
    },
  });
}

export async function getById(id: number) {
  return prisma.comment.findUnique({
    where: { id },
  });
}

export async function getAll() {
  return prisma.comment.findMany();
}

export async function update(id: number, data: {content?: string}) {
  return prisma.comment.update({
    where: { id },
    data,
  });
}

export async function deleteById(id: number) {
  return prisma.comment.delete({
    where: { id },
  });
}

export const commentRepository = {
  ProductComment,
  ArticleComment,
  getById,
  getAll,
  update,
  deleteById,
};
