import prisma from '../lib/prismaClient.js';

export async function findById(id) {
  return prisma.article.findUnique({
    where: { id },
  });
}

export async function getById(id) {
  return prisma.article.findUnique({
    where: { id: parseInt(id, 10) },
    select: {
      id: true,
      title: true,
      content: true,
      authorId: true
    },
  });
}

export async function findAll({ skip = 0, take = 10, orderBy, keyword }) {
  const where = keyword
    ? {
      OR: [
        { title: { contains: keyword } },
        { content: { contains: keyword } },
      ],
    }
    : undefined;

  return prisma.article.findMany({
    skip,
    take,
    where,
    orderBy,
  });
}

export async function save(data) {
  return prisma.article.create({ data });
}

export async function update(id, data) {
  return prisma.article.update({
    where: { id },
    data,
  });
}

export async function deleteById(id) {
  return prisma.article.delete({
    where: { id },
  });
}
export const articleRepository = {
  findById,
  findAll,
  getById,
  save,
  update,
  deleteById,
};

