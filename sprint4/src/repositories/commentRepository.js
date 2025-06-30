import prisma from '../lib/prismaClient.js';

export async function save(comment) {
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

export async function getById(id) {
  return prisma.comment.findUnique({
    where: { id: parseInt(id, 10) },
  });
}

export async function getAll() {
  return prisma.comment.findMany();
}

export async function update(id, content) {
  return prisma.comment.update({
    where: { id: parseInt(id, 10) },
    data: { content },
  });
}

export async function deleteById(id) {
  return prisma.comment.delete({
    where: { id: parseInt(id, 10) },
  });
}

export const commentRepository = {
  save,
  getById,
  getAll,
  update,
  deleteById,
};
