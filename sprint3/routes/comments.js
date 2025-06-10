import express from 'express';
import * as commentsController from '../controllers/commentsController.js';

const router = express.Router();

router.post('/', commentsController.createComment); 

router.patch('/:id', commentsController.updateComment);

router.delete('/:id', commentsController.deleteComment);

router.get('/', commentsController.getComments);

router.get('/product/:productId', commentsController.getProductComments);

router.get('/article/:articleId', commentsController.getArticleComments);

export default router;