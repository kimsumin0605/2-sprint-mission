import { create } from 'superstruct';
import * as commentService from '../services/commentService'
import { CreateCommentBodyStruct, UpdateCommentBodyStruct } from '../structs/commentsStruct';
import { withAsync } from '../lib/withAsync';
import { Request, Response } from 'express';
import { CreateCommentInput } from '../types/comment';
import { requireUser } from '../lib/assertUser';

export const createComment = withAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content } = create(req.body, CreateCommentBodyStruct);
  const user = requireUser(req);

  const input: CreateCommentInput = {
    content,
    authorId: user.id,
    articleId: req.baseUrl.includes('articles') ? parseInt(id, 10) : undefined,
    productId: req.baseUrl.includes('products') ? parseInt(id, 10) : undefined,
  };

  const comment = await commentService.createComment(input);

  res.status(201).json(comment);
});

export const getCommentList = withAsync(async (req: Request, res: Response) => {
  const comments = await commentService.getAllComments();
  res.json(comments);
});

export const updateComment = withAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content } = create(req.body, UpdateCommentBodyStruct);

  if (!content) {
    throw new Error('내용을 입력하세요.');
  }
  const updated = await commentService.updateComment(parseInt(id, 10), content);
  res.json(updated);
});

export const deleteComment = withAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await commentService.deleteComment(parseInt(id, 10));
  res.status(204).send();
});
