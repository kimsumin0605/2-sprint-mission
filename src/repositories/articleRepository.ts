import prisma from "../lib/prismaClient";
import { Article, Prisma } from "@prisma/client";

export class ArticleRepository {
  async create(data: Prisma.ArticleCreateInput): Promise<Article> {
    return prisma.article.create({ data });
  }

  async findById(id: number): Promise<Article | null> {
    return prisma.article.findUnique({
      where: { id },
    });
  }

  async getById(
    id: number
  ): Promise<Pick<Article, "id" | "title" | "content" | "authorId"> | null> {
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

  async findAll(params: {
    skip?: number;
    take?: number;
    orderBy?: "recent" | "old";
    keyword?: string;
  }): Promise<Article[]> {
    const { skip = 0, take = 10, orderBy = "recent", keyword = "" } = params;

    const where = keyword
      ? {
          OR: [
            { title: { contains: keyword } },
            { content: { contains: keyword } },
          ],
        }
      : undefined;

    const prismaOrderBy: Prisma.ArticleOrderByWithRelationInput =
      orderBy === "recent" ? { createdAt: "desc" } : { createdAt: "asc" };

    return prisma.article.findMany({
      skip,
      take,
      where,
      orderBy: prismaOrderBy,
    });
  }

  async update(id: number, data: Prisma.ArticleUpdateInput): Promise<Article> {
    return prisma.article.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Article> {
    return prisma.article.delete({
      where: { id },
    });
  }
}
