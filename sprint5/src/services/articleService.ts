import { articleRepository } from '../repositories/articleRepository';
import { likeRepository } from '../repositories/likeRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import { Prisma } from '@prisma/client';
import { ArticleListQuery } from '../types/article';
import { ForbiddenError } from '../lib/errors/BadRequestError';
import { UpdateArticleInput } from '../types/article';


export async function createArticle(data: Omit<Prisma.ArticleCreateInput, 'author'>, userId: number) {
  return await articleRepository.save({
    ...data,
    author: { connect: { id: userId } },
  });
}

export async function getArticleById(id: number, userId?: number) {
  const article = await articleRepository.getById(id);
  if (!article) throw new NotFoundError('Article', id);

  let isLiked = false;
  if (userId) {
    const like = await likeRepository.find(userId, undefined, id);
    isLiked = !!like;
  }

  return {
    ...article,
    isLiked,
  };
}

export async function getAllArticles(query: ArticleListQuery) {
  const { skip = 0, take = 10, orderBy, keyword } = query;
  return await articleRepository.findAll({ skip, take, orderBy, keyword });
}

export async function updateArticle(
  articleId: number,
  updateData: UpdateArticleInput,
  userId: number
) {
  const article = await articleRepository.getById(articleId);
  if (!article) throw new NotFoundError('게시글', articleId);

  if (article.authorId !== userId) {
    throw new ForbiddenError('게시글을 수정할 권한이 없습니다.');
  }

  return await articleRepository.update(articleId, updateData);
}

export async function deleteArticle(id: number) {
  const exists = await articleRepository.getById(id);
  if (!exists) throw new NotFoundError('Article', id);

  return await articleRepository.deleteById(id);
}
