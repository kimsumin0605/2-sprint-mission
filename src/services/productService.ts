import { ProductRepository } from "../repositories/productRepository";
import { LikeRepository } from "../repositories/likeRepository";
import NotFoundError from "../lib/errors/NotFoundError";
import { ForbiddenError } from "../lib/errors/BadRequestError";
import { Prisma } from "@prisma/client";
import { CreateProductInput } from "../dtos/product.dto";
import { NotificationService } from "../services/notificationService";

const productRepository = new ProductRepository();
const likeRepository = new LikeRepository();
const notificationService = new NotificationService();

export class ProductService {
  async createProduct(data: CreateProductInput) {
    return productRepository.create(data);
  }

  async getProductById(id: number, userId?: number | null) {
    const product = await productRepository.getById(id);
    if (!product) throw new NotFoundError("Product", id);

    let isLiked = false;
    if (userId) {
      const like = await likeRepository.find(userId, id);
      isLiked = !!like;
    }

    return { ...product, isLiked };
  }

  async getAllProducts(page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;
    return productRepository.getAll({ skip, take: pageSize });
  }

  async updateProduct(
    productId: number,
    updateData: Prisma.ProductUpdateInput,
    userId: number
  ) {
    const product = await productRepository.getById(productId);
    if (!product) throw new NotFoundError("상품", productId);

    if (product.authorId !== userId) {
      throw new ForbiddenError("상품을 수정할 권한이 없습니다.");
    }

    const oldPrice = product.price;
    const updatedProduct = await productRepository.update(
      productId,
      updateData
    );

    if (updateData.price && updateData.price !== oldPrice) {
      const likedUsers = await likeRepository.findLikedProducts(productId);

      for (const user of likedUsers) {
        await notificationService.createNotification(user.id, {
          type: "PRICE_CHANGE",
          message: `${product.name} 상품의 가격이 변경되었습니다.`,
          data: { productId, oldPrice, newPrice: updateData.price },
        });
      }
    }

    return productRepository.update(productId, updateData);
  }

  async deleteProduct(id: number) {
    const exists = await productRepository.getById(id);
    if (!exists) throw new NotFoundError("Product", id);
    return productRepository.delete(id);
  }

  async getMyProducts(userId: number) {
    return productRepository.findByAuthorId(userId);
  }
}
