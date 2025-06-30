import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import {
  createComment,
  getCommentList,
  updateComment,
  deleteComment,
} from '../controllers/commentsController.js';
import passport from '../middlewares/passport.js';
import { authenticate } from '../middlewares/authenticate.js';

const commentsRouter = express.Router();

commentsRouter.use(passport.authenticate('access-token', { session: false }));

commentsRouter.get('/', withAsync(getCommentList));
commentsRouter.post('/articles/:id', withAsync(createComment));
commentsRouter.post('/products/:id', withAsync(createComment));
commentsRouter.patch('/:id', authenticate.verifyCommentAuth, withAsync(updateComment));
commentsRouter.delete('/:id', authenticate.verifyCommentAuth, withAsync(deleteComment));

export default commentsRouter;
