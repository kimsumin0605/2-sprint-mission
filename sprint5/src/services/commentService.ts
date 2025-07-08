import { commentRepository } from '../repositories/commentRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import { CreateCommentInput } from '../types/comment';

export async function createComment({ content,
  authorId,
  articleId,
  productId
}: CreateCommentInput) {
  return commentRepository.save({ content, authorId, articleId, productId });
}

export async function getCommentById(id: number) {
  const comment = await commentRepository.getById(id);
  if (!comment) throw new NotFoundError('Comment', id);
  return comment;
}

export async function getAllComments() {
  return commentRepository.getAll();
}

export async function updateComment(id: number, content: string) {
  const exists = await commentRepository.getById(id);
  if (!exists) throw new NotFoundError('Comment', id);

  return commentRepository.update(id, content);
}

export async function deleteComment(id: number) {
  const exists = await commentRepository.getById(id);
  if (!exists) throw new NotFoundError('Comment', id);

  return commentRepository.deleteById(id);
}
