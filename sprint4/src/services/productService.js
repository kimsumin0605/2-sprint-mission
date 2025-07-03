import { productRepository } from '../repositories/productRepository.js';
import { likeRepository } from '../repositories/likeRepository.js';
import NotFoundError from '../lib/errors/NotFoundError.js';

export async function createProduct(productData) {
  return await productRepository.save(productData);
}

export async function getProductById(id, userId = null) {
  const product = await productRepository.getById(id);
  if (!product) throw new NotFoundError('Product', id);

  let isLiked = false;

  if (userId) {
    const like = await likeRepository.find(userId, id, null);
    isLiked = !!like;
  }

  return { ...product, isLiked };
}

export async function getAllProducts() {
  return await productRepository.getAll();
}

export async function updateProduct(productId, updateData) {
  const exists = await productRepository.getById(productId);
  if (!exists) throw new NotFoundError('Product', productId);

  const updated = await productRepository.update(productId, updateData);
  return updated;
}

export async function deleteProduct(productId) {
  const exists = await productRepository.getById(productId);
  if (!exists) throw new NotFoundError('Product', productId);

  await productRepository.deleteById(productId);
}

export async function getMyProducts(userId) {
  return await productRepository.findByAuthorId(userId);
}

export async function addCommentToProduct(commentData) {
  return await productRepository.createComment(commentData);
}

export async function getProductComments(productId, cursor, limit = 10) {
  const exists = await productRepository.getById(productId);
  if (!exists) throw new NotFoundError('Product', productId);

  const comments = await productRepository.getComments(productId, cursor, limit);
  const hasNextPage = comments.length > limit;

  if (hasNextPage) comments.pop();

  return { comments, hasNextPage };
}
