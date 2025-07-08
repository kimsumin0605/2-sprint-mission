import { articleRepository } from '../repositories/articleRepository';
import { likeRepository } from '../repositories/likeRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import { Prisma } from '@prisma/client';
import { ArticleListQuery } from '../types/article';
import { UpdateArticleBodyStruct } from '../structs/articlesStructs';
import { Infer } from 'superstruct';

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

type UpdateArticleInput = Infer<typeof UpdateArticleBodyStruct>
export async function updateArticle(id: number, data: UpdateArticleInput) {
  const exists = await articleRepository.getById(id);
  if (!exists) throw new NotFoundError('Article', id);

  return await articleRepository.update(id, data);
}

export async function deleteArticle(id: number) {
  const exists = await articleRepository.getById(id);
  if (!exists) throw new NotFoundError('Article', id);

  return await articleRepository.deleteById(id);
}
