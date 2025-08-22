import prisma from "../lib/prismaClient";

export class CommentRepository {
  async createForProduct(input: {
    content: string;
    authorId: number;
    productId: number;
  }) {
    return prisma.comment.create({
      data: {
        content: input.content,
        author: { connect: { id: input.authorId } },
        product: { connect: { id: input.productId } },
      },
    });
  }

  async createForArticle(input: {
    content: string;
    authorId: number;
    articleId: number;
  }) {
    return prisma.comment.create({
      data: {
        content: input.content,
        author: { connect: { id: input.authorId } },
        article: { connect: { id: input.articleId } },
      },
    });
  }

  async getById(id: number) {
    return prisma.comment.findUnique({ where: { id } });
  }

  async getAll() {
    return prisma.comment.findMany();
  }

  async update(id: number, data: { content: string }) {
    return prisma.comment.update({ where: { id }, data });
  }

  async deleteById(id: number) {
    return prisma.comment.delete({ where: { id } });
  }
}
