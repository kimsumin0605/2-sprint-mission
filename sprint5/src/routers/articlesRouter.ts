import express from 'express';
import { withAsync } from '../lib/withAsync';
import {
  createArticle,
  getArticleList,
  getArticle,
  updateArticle,
  deleteArticle,
} from '../controllers/articlesController';
import { verifyAccessToken } from '../middlewares/passport';

const articlesRouter = express.Router();

articlesRouter.get('/', withAsync(getArticleList));
articlesRouter.get('/:id', withAsync(getArticle));

articlesRouter.use(verifyAccessToken);

articlesRouter.post('/', withAsync(createArticle));
articlesRouter.patch('/:id', withAsync(updateArticle));
articlesRouter.delete('/:id', withAsync(deleteArticle));

export default articlesRouter;
