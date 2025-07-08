import prisma from '../lib/prismaClient';
import { CreateCommentInput } from '../types/comment';

export async function save(comment: CreateCommentInput) {
  const createdComment = await prisma.comment.create({
    data: {
      content: comment.content,
      author: {
        connect: { id: comment.authorId },
      },
      ...(comment.productId && {
        product: { connect: { id: comment.productId } },
      }),
      ...(comment.articleId && {
        article: { connect: { id: comment.articleId } },
      }),
    },
  });
  return createdComment;
}

export async function getById(id: number) {
  return prisma.comment.findUnique({
    where: { id },
  });
}

export async function getAll() {
  return prisma.comment.findMany();
}

export async function update(id: number, content: string) {
  return prisma.comment.update({
    where: { id },
    data: { content },
  });
}

export async function deleteById(id: number) {
  return prisma.comment.delete({
    where: { id },
  });
}

export const commentRepository = {
  save,
  getById,
  getAll,
  update,
  deleteById,
};
