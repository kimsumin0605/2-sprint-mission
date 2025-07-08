import express from 'express';
import { withAsync } from '../lib/withAsync';
import {
  toggleArticleLike,
  toggleProductLike,
  getLikedProducts,
  getLikedArticles,
} from '../controllers/likeController';
import { authenticate } from '../middlewares/authenticate';

const likesRouter = express.Router();

likesRouter.use(authenticate.verifyAccessToken);

likesRouter.post('/articles/:id', withAsync(toggleArticleLike));
likesRouter.post('/products/:id', withAsync(toggleProductLike));
likesRouter.get('/products', withAsync(getLikedProducts));
likesRouter.get('/articles', withAsync(getLikedArticles));

export default likesRouter;
