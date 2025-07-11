import express from 'express';
import { withAsync } from '../lib/withAsync';
import {
  createArticleComment,
  createProductComment,
  getCommentList,
  updateComment,
  deleteComment,
} from '../controllers/commentsController';
import passport from '../middlewares/passport';

const commentsRouter = express.Router();

commentsRouter.use(passport.authenticate('access-token', { session: false }));

commentsRouter.get('/', withAsync(getCommentList));

// 게시글 댓글 생성
commentsRouter.post('/articles/:id', withAsync(createArticleComment));

// 상품 댓글 생성
commentsRouter.post('/products/:id', withAsync(createProductComment));

commentsRouter.patch('/:id', withAsync(updateComment));
commentsRouter.delete('/:id', withAsync(deleteComment));

export default commentsRouter;
