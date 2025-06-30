import { productRepository } from '../repositories/productRepository.js';
import { likeRepository } from '../repositories/likeRepository.js';
import NotFoundError from '../lib/errors/NotFoundError.js';

export async function createProductService(productData) {
  return await productRepository.save(productData);
}

export async function getProductByIdService(id, userId = null) {
  const product = await productRepository.getById(id);
  if (!product) throw new NotFoundError('Product', id);

  let isLiked = false;

  if (userId) {
    const like = await likeRepository.find(userId, id, null);
    isLiked = !!like;
  }

  return { ...product, isLiked };
}

export async function getAllProductsService() {
  return await productRepository.getAll();
}

export async function updateProductService(productId, updateData) {
  const exists = await productRepository.getById(productId);
  if (!exists) throw new NotFoundError('Product', productId);

  const updated = await productRepository.update(productId, updateData);
  return updated;
}

export async function deleteProductService(productId) {
  const exists = await productRepository.getById(productId);
  if (!exists) throw new NotFoundError('Product', productId);

  await productRepository.deleteById(productId);
}

export async function getMyProductsService(userId) {
  return await productRepository.findByAuthorId(userId);
}

export async function addCommentToProductService(commentData) {
  return await productRepository.createComment(commentData);
}

export async function getProductCommentsService(productId, cursor, limit = 10) {
  const exists = await productRepository.getById(productId);
  if (!exists) throw new NotFoundError('Product', productId);

  const comments = await productRepository.getComments(productId, cursor, limit);
  const hasNextPage = comments.length > limit;

  if (hasNextPage) comments.pop();

  return { comments, hasNextPage };
}
