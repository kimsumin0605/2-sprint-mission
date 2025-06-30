import { articleRepository } from '../repositories/articleRepository.js';
import { likeRepository } from '../repositories/likeRepository.js';
import NotFoundError from '../lib/errors/NotFoundError.js';

export async function createArticle(data, userId) {
  return await articleRepository.save({
    ...data,
    author: { connect: { id: userId } },
  });
}

export async function getArticleById(id, userId = null) {
  const article = await articleRepository.getById(id);
  if (!article) throw new NotFoundError('Article', id);

  let isLiked = false;
  if (userId) {
    const like = await likeRepository.find(userId, null, id);
    isLiked = !!like;
  }

  return {
    ...article,
    isLiked,
  };
}

export async function getAllArticles(query) {
  const { skip = 0, take = 10, orderBy, keyword } = query;
  return await articleRepository.findAll({ skip, take, orderBy, keyword });
}

export async function updateArticle(id, data) {
  const exists = await articleRepository.getById(id);
  if (!exists) throw new NotFoundError('Article', id);

  return await articleRepository.update(id, data);
}

export async function deleteArticle(id) {
  const exists = await articleRepository.getById(id);
  if (!exists) throw new NotFoundError('Article', id);

  return await articleRepository.deleteById(id);
}
