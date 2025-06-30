import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductList,
  createComment,
  getCommentList,
  getMyProducts,
} from '../controllers/productsController.js';
import { authenticate } from '../middlewares/authenticate.js';

const productsRouter = express.Router();

productsRouter.get('/', withAsync(getProductList));
productsRouter.get('/:id', withAsync(getProduct));

productsRouter.use(authenticate.verifyAccessToken);

productsRouter.post('/', withAsync(createProduct));
productsRouter.patch('/:id', authenticate.verifyProductAuth, withAsync(updateProduct));
productsRouter.delete('/:id', authenticate.verifyProductAuth, withAsync(deleteProduct));
productsRouter.post('/:id/comments', withAsync(createComment));
productsRouter.get('/me', withAsync(getMyProducts));
productsRouter.get('/:id/comments', withAsync(getCommentList));

export default productsRouter;
