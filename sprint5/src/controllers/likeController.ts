import { create } from 'superstruct';
import * as likeService from '../services/likeService';
import { IdParamsStruct } from '../structs/commonStructs';
import { withAsync } from '../lib/withAsync';
import { Request, Response } from 'express';
import { requireUser } from '../lib/assertUser';

export const toggleProductLike = withAsync(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { id: productId } = create(req.params, IdParamsStruct);
  const result = await likeService.toggleLike({ userId: user.id, productId });
  res.status(200).json(result);
});

export const toggleArticleLike = withAsync(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { id: articleId } = create(req.params, IdParamsStruct);
  const result = await likeService.toggleLike({ userId: user.id, articleId });
  res.status(200).json(result);
});

export const getLikedProducts = withAsync(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const likes = await likeService.getLikedProductsByUser(user.id);
  res.json(likes);
});

export const getLikedArticles = withAsync(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const likes = await likeService.getLikedArticlesByUser(user.id);
  res.json(likes);
});


