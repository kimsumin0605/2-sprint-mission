import { create } from 'superstruct';
import * as commentService from '../services/commentService';
import { CreateCommentBodyStruct, UpdateCommentBodyStruct } from '../structs/commentsStruct';
import { withAsync } from '../lib/withAsync';
import { Request, Response } from 'express';
import { requireUser } from '../lib/assertUser';

export const createProductComment = withAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content } = create(req.body, CreateCommentBodyStruct);
  const user = requireUser(req);

  const input = {
    content,
    authorId: user.id,
    productId: parseInt(id, 10),
  };

  const comment = await commentService.ProductComment(input);

  res.status(201).json(comment);
});

export const createArticleComment = withAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content } = create(req.body, CreateCommentBodyStruct);
  const user = requireUser(req);

  const input = {
    content,
    authorId: user.id,
    articleId: parseInt(id, 10),
  };

  const comment = await commentService.ArticleComment(input);

  res.status(201).json(comment);
});

export const getCommentList = withAsync(async (req: Request, res: Response) => {
  const comments = await commentService.getAllComments();
  res.json(comments);
});

export const updateComment = withAsync(async (req: Request, res: Response) => {
  const { id } = req.params; 
  const user = requireUser(req); 

  const updateData = create(req.body, UpdateCommentBodyStruct);

  if (!updateData.content) {
    res.status(400).json({ message: '내용을 입력하세요.' });
    return;
  }

  const updatedComment = await commentService.updateComment(
    parseInt(id, 10),
    updateData,
    user.id
  );

  res.status(200).json(updatedComment);
});

export const deleteComment = withAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await commentService.deleteComment(parseInt(id, 10));
  res.status(204).send();
});
