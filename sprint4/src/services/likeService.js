import { likeRepository } from '../repositories/likeRepository.js';

export async function toggleLike({ userId, productId = null, articleId = null }) {
  const isLiked = await likeRepository.find(userId, productId, articleId);

  if (isLiked) {
    await likeRepository.remove(userId, productId, articleId);
    return { liked: false };
  } else {
    await likeRepository.create(userId, productId, articleId);
    return { liked: true };
  }
}

export async function getLikedProductsByUser(userId) {
  return likeRepository.findLikedProducts(userId);
}

