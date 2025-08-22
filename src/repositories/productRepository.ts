import prisma from "../lib/prismaClient";
import { Prisma } from "@prisma/client";
import { CreateProductInput } from "../dtos/product.dto";

export class ProductRepository {
  async create(data: CreateProductInput) {
    return prisma.product.create({ data });
  }

  async getById(id: number) {
    return prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        authorId: true,
      },
    });
  }

  async getAll({ skip = 0, take = 10 }: { skip?: number; take?: number }) {
    return prisma.product.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        authorId: true,
      },
    });
  }

  async update(id: number, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.product.delete({ where: { id } });
  }

  async findByAuthorId(authorId: number) {
    return prisma.product.findMany({ where: { authorId } });
  }
}
