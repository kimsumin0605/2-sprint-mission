import { commentRepository } from '../repositories/commentRepository.js';
import NotFoundError from '../lib/errors/NotFoundError.js';

export async function createComment({ content, authorId, articleId, productId }) {
  return commentRepository.save({ content, authorId, articleId, productId });
}

export async function getCommentById(id) {
  const comment = await commentRepository.getById(id);
  if (!comment) throw new NotFoundError('Comment', id);
  return comment;
}

export async function getAllComments() {
  return commentRepository.getAll();
}

export async function updateComment(id, content) {
  const exists = await commentRepository.getById(id);
  if (!exists) throw new NotFoundError('Comment', id);

  return commentRepository.update(id, content);
}

export async function deleteComment(id) {
  const exists = await commentRepository.getById(id);
  if (!exists) throw new NotFoundError('Comment', id);

  return commentRepository.deleteById(id);
}
