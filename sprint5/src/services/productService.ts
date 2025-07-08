import { productRepository } from '../repositories/productRepository';
import { likeRepository } from '../repositories/likeRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import { CreateProductInput } from '../types/product';
import { CreateCommentInput } from '../types/comment';
import { Prisma, Product, Comment } from '@prisma/client';
import { PageParamsStruct } from '../structs/commonStructs';

export async function createProduct(productData: CreateProductInput): Promise<Product> {
  return await productRepository.save(productData);
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

export async function updateProduct(productId: number, updateData: Prisma.ProductUpdateInput) {
  const exists = await productRepository.getById(productId);
  if (!exists) throw new NotFoundError('Product', productId);

  const updated = await productRepository.update(productId, updateData);
  return updated;
}

export async function deleteProduct(productId: number) {
  const exists = await productRepository.getById(productId);
  if (!exists) throw new NotFoundError('Product', productId);

  await productRepository.deleteById(productId);
}

export async function getMyProducts(userId: number) {
  return await productRepository.findByAuthorId(userId);
}

export async function addCommentToProduct(commentData: CreateCommentInput) {
  return await productRepository.createComment(commentData);
}

export async function getProductComments(
  productId: number,
  cursor?: number,
  limit: number = 10
): Promise<{ comments: Comment[]; hasNextPage: boolean }> {
  const exists = await productRepository.getById(productId);
  if (!exists) throw new NotFoundError('Product', productId);

  const comments = await productRepository.getComments(productId, cursor, limit);
  const hasNextPage = comments.length > limit;

  if (hasNextPage) comments.pop();
  return { comments, hasNextPage };
}

