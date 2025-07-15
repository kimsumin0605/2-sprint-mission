import prisma from '../lib/prismaClient';
import { Article, Prisma } from '@prisma/client';
import { ArticleListQuery } from '../types/article';

export async function findById(id: number): Promise<Article | null> {
  return prisma.article.findUnique({
    where: { id },
  });
}

export async function getById(id: number): Promise<Pick<Article, 'id' | 'title' | 'content' | 'authorId'> | null> {
  return prisma.article.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      authorId: true,
    },
  });
}

export async function findAll({
  skip = 0,
  take = 10,
  orderBy = 'recent',
  keyword = ''
}: ArticleListQuery): Promise<Article[]> {
  const where = keyword
    ? {
      OR: [
        { title: { contains: keyword } },
        { content: { contains: keyword } },
      ],
    }
    : undefined;

  const prismaOrderBy: Prisma.ArticleOrderByWithRelationInput =
    orderBy === 'recent'
      ? { createdAt: 'desc' }
      : { createdAt: 'asc' };

  return prisma.article.findMany({
    skip,
    take,
    where,
    orderBy: prismaOrderBy,
  });
}

export async function save(data: Prisma.ArticleCreateInput): Promise<Article> {
  return prisma.article.create({ data });
}

export async function update(id: number, data: Prisma.ArticleUpdateInput): Promise<Article> {
  return prisma.article.update({
    where: { id },
    data,
  });
}

export async function deleteById(id: number): Promise<Article> {
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

