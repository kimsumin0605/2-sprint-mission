import { commentRepository } from '../repositories/commentRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import { CreateCommentInput, UpdateCommentInput } from '../types/comment';
import { ForbiddenError } from '../lib/errors/BadRequestError';

export async function ProductComment(input: CreateCommentInput) {
  if (!input.productId) throw new Error('상품 아이디가 아닙니다.');
  return commentRepository.ProductComment(input);
}

export async function ArticleComment(input: CreateCommentInput) {
  if (!input.articleId) throw new Error('게시글 아이디가 아닙니다');
  return commentRepository.ArticleComment(input);
}

export async function getCommentById(id: number) {
  const comment = await commentRepository.getById(id);
  if (!comment) throw new NotFoundError('Comment', id);
  return comment;
}

export async function getAllComments() {
  return commentRepository.getAll();
}

export async function updateComment(
  commentId: number,
  updateData: UpdateCommentInput,
  userId: number
) {
  const comment = await commentRepository.getById(commentId);
  if (!comment) throw new NotFoundError('댓글', commentId);

  if (comment.authorId !== userId) {
    throw new ForbiddenError('댓글을 수정할 권한이 없습니다.');
  }

  return commentRepository.update(commentId, updateData);
}



export async function deleteComment(id: number) {
  const exists = await commentRepository.getById(id);
  if (!exists) throw new NotFoundError('Comment', id);

  return commentRepository.deleteById(id);
}
