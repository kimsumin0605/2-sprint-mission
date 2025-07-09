import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import {
  createArticle,
  getArticleList,
  getArticle,
  updateArticle,
  deleteArticle,
} from '../controllers/articlesController.js';
import { authenticate } from '../middlewares/authenticate.js';

const articlesRouter = express.Router();

articlesRouter.get('/', withAsync(getArticleList));
articlesRouter.get('/:id', withAsync(getArticle));

articlesRouter.use(authenticate.verifyAccessToken);

articlesRouter.post('/', withAsync(createArticle));
articlesRouter.patch('/:id', authenticate.verifyArticleAuth, withAsync(updateArticle));
articlesRouter.delete('/:id', authenticate.verifyArticleAuth, withAsync(deleteArticle));

export default articlesRouter;
