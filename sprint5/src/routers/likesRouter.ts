import express from 'express';
import { withAsync } from '../lib/withAsync';
import {
  toggleArticleLike,
  toggleProductLike,
  getLikedProducts,
  getLikedArticles,
} from '../controllers/likeController';
import { verifyAccessToken } from '../middlewares/passport';

const likesRouter = express.Router();

likesRouter.use(verifyAccessToken);

likesRouter.post('/articles/:id', withAsync(toggleArticleLike));
likesRouter.post('/products/:id', withAsync(toggleProductLike));
likesRouter.get('/products', withAsync(getLikedProducts));
likesRouter.get('/articles', withAsync(getLikedArticles));

export default likesRouter;
