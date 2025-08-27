import { ArticleRepository } from "../repositories/articleRepository";
import { LikeRepository } from "../repositories/likeRepository";
import NotFoundError from "../lib/errors/NotFoundError";
import { ForbiddenError } from "../lib/errors/BadRequestError";
import { Prisma } from "@prisma/client";

const likeRepository = new LikeRepository();
const articleRepository = new ArticleRepository();

export class ArticleService {
  async create(data: Prisma.ArticleCreateInput) {
    return articleRepository.create(data);
  }

  async getById(id: number, userId?: number) {
    const article = await articleRepository.getById(id);
    if (!article) throw new NotFoundError("Article", id);

    const isLiked = userId
      ? !!(await likeRepository.find(userId, undefined, id))
      : false;

    return { ...article, isLiked };
  }

  async getList(query: any) {
    return articleRepository.findAll(query);
  }

  async update(id: number, data: Prisma.ArticleUpdateInput, userId: number) {
    const article = await articleRepository.getById(id);
    if (!article) throw new NotFoundError("게시글", id);
    if (article.authorId !== userId)
      throw new ForbiddenError("게시글을 수정할 권한이 없습니다.");

    return articleRepository.update(id, data);
  }

  async delete(id: number) {
    const exists = await articleRepository.getById(id);
    if (!exists) throw new NotFoundError("Article", id);
    return articleRepository.delete(id);
  }
}
