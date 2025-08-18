import prisma from '../lib/prismaClient';

export const likeRepository = {
  async find(userId: number, productId?: number, articleId?: number) {
    return prisma.like.findFirst({
      where: {
        userId,
        productId: productId || undefined,
        articleId: articleId || undefined,
      },
    });
  },

  async create(userId: number, productId?: number, articleId?: number) {
    return prisma.like.create({
      data: {
        userId,
        productId,
        articleId,
      },
    });
  },

  async remove(userId: number, productId?: number, articleId?: number) {
    return prisma.like.deleteMany({
      where: {
        userId,
        productId: productId || undefined,
        articleId: articleId || undefined,
      },
    });
  },

  async findLikedProducts(userId: number) {
    return prisma.like.findMany({
      where: { userId, productId: { not: null } },
      include: {
        product: true,
      },
    });
  },
  async findLikedArticles(userId: number) {
    return prisma.like.findMany({
      where: { userId, articleId: { not: null } },
      include: {
        article: true,
      },
    });
  }
};
