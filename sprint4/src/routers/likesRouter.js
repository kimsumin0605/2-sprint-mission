import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import {
  toggleArticleLike,
  toggleProductLike,
  getLikedProducts,
} from '../controllers/likeController.js';
import { authenticate } from '../middlewares/authenticate.js';

const likesRouter = express.Router();

likesRouter.use(authenticate.verifyAccessToken);

likesRouter.post('/articles/:id', withAsync(toggleArticleLike));
likesRouter.post('/products/:id', withAsync(toggleProductLike));
likesRouter.get('/products', withAsync(getLikedProducts));

export default likesRouter;
