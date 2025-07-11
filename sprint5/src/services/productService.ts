import { productRepository } from '../repositories/productRepository';
import { likeRepository } from '../repositories/likeRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import { ForbiddenError } from '../lib/errors/BadRequestError';
import { CreateProductInput } from '../types/product';
import { Prisma, Product } from '@prisma/client';
import { PageParamsStruct } from '../structs/commonStructs';

export async function createProduct(productData: CreateProductInput): Promise<Product> {
  return await productRepository.createProduct(productData);
}

export async function getProductById(id: number, userId?: number | null) {
  const product = await productRepository.getById(id);
  if (!product) throw new NotFoundError('Product', id);

  let isLiked = false;

  if (userId) {
    const like = await likeRepository.find(userId, id, undefined);
    isLiked = !!like;
  }

  return { ...product, isLiked };
}

export async function getAllProducts(params: typeof PageParamsStruct.TYPE) {
  const { page, pageSize } = params
  return await productRepository.getAll({
    skip: (page - 1) * pageSize,
    take: pageSize
  });
}

export async function updateProduct(
  productId: number,
  updateData: Prisma.ProductUpdateInput,
  userId: number
) {
  const product = await productRepository.getById(productId);
  if (!product) throw new NotFoundError('상품', productId);

  if (product.authorId !== userId) {
    throw new ForbiddenError('상품을 수정할 권한이 없습니다.');
  }

  return await productRepository.update(productId, updateData);
}

export async function deleteProduct(productId: number) {
  const exists = await productRepository.getById(productId);
  if (!exists) throw new NotFoundError('Product', productId);

  await productRepository.deleteProduct(productId);
}

export async function getMyProducts(userId: number) {
  return await productRepository.findByAuthorId(userId);
}



