import { create } from 'superstruct';
import * as likeService from '../services/likeService.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import { withAsync } from '../lib/withAsync.js';

export const toggleProductLike = withAsync(async (req, res) => {
  const { id: productId } = create(req.params, IdParamsStruct);
  const result = await likeService.toggleLike({ userId: req.user.id, productId });
  res.status(200).json(result);
});

export const toggleArticleLike = withAsync(async (req, res) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const result = await likeService.toggleLike({ userId: req.user.id, articleId });
  res.status(200).json(result);
});

export const getLikedProducts = withAsync(async (req, res) => {
  const likes = await likeService.getLikedProductsByUser(req.user.id);
  res.json(likes);
});
