import { LikeRepository } from "../repositories/likeRepository";
import { BadRequestError } from "../lib/errors/BadRequestError";

const likeRepository = new LikeRepository();
export class LikeService {
  async toggleLike({
    userId,
    productId = null,
    articleId = null,
  }: {
    userId: number;
    productId?: number | null;
    articleId?: number | null;
  }) {
    if ((productId && articleId) || (!productId && !articleId)) {
      throw new BadRequestError(
        "productId 또는 articleId 중 하나만 있어야 합니다."
      );
    }

    const isLiked = await likeRepository.find(
      userId,
      productId ?? undefined,
      articleId ?? undefined
    );

    if (isLiked) {
      await likeRepository.remove(
        userId,
        productId ?? undefined,
        articleId ?? undefined
      );
      return { liked: false };
    } else {
      await likeRepository.create(
        userId,
        productId ?? undefined,
        articleId ?? undefined
      );
      return { liked: true };
    }
  }

  async getLikedProductsByUser(userId: number) {
    return likeRepository.findLikedProducts(userId);
  }

  async getLikedArticlesByUser(userId: number) {
    return likeRepository.findLikedArticles(userId);
  }
}

export const likeService = new LikeService();
