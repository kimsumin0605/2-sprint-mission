import { create } from 'superstruct';
import * as commentService from '../services/commentService.js';
import { CreateCommentBodyStruct } from '../structs/commentsStruct.js';
import { withAsync } from '../lib/withAsync.js';

export const createComment = withAsync(async (req, res) => {
  const { id } = req.params;
  const { content } = create(req.body, CreateCommentBodyStruct);

  const comment = await commentService.createComment({
    content,
    authorId: req.user.id,
    articleId: req.baseUrl.includes('articles') ? parseInt(id, 10) : null,
    productId: req.baseUrl.includes('products') ? parseInt(id, 10) : null,
  });

  res.status(201).json(comment);
});

export const getCommentList = withAsync(async (req, res) => {
  const comments = await commentService.getAllComments();
  res.json(comments);
});

export const updateComment = withAsync(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const updated = await commentService.updateComment(parseInt(id, 10), content);
  res.json(updated);
});

export const deleteComment = withAsync(async (req, res) => {
  const { id } = req.params;
  await commentService.deleteComment(parseInt(id, 10));
  res.status(204).send();
});
