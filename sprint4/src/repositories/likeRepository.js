import prisma from '../lib/prismaClient.js';

export const likeRepository = {
  async find(userId, productId, articleId) {
    return prisma.like.findFirst({
      where: {
        userId,
        productId: productId || undefined,
        articleId: articleId || undefined,
      },
    });
  },

  async create(userId, productId, articleId) {
    return prisma.like.create({
      data: {
        userId,
        productId,
        articleId,
      },
    });
  },

  async remove(userId, productId, articleId) {
    return prisma.like.deleteMany({
      where: {
        userId,
        productId: productId || undefined,
        articleId: articleId || undefined,
      },
    });
  },

  async findLikedProducts(userId) {
    return prisma.like.findMany({
      where: { userId, productId: { not: null } },
      include: {
        product: true,
      },
    });
  },
  async findLikedArticles(userId) {
    return prisma.like.findMany({
      where: { userId, articleId: { not: null } },
      include: {
        article: true,
      },
    });
  }
};
