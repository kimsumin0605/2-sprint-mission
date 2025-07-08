import express from 'express';
import { withAsync } from '../lib/withAsync';
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductList,
  createComment,
  getCommentList,
  getMyProducts,
} from '../controllers/productsController';
import { authenticate } from '../middlewares/authenticate';

const productsRouter = express.Router();

productsRouter.get('/', withAsync(getProductList));
productsRouter.get('/:id/comments', withAsync(getCommentList));
productsRouter.get('/:id', withAsync(getProduct));

productsRouter.use(authenticate.verifyAccessToken);

productsRouter.post('/', withAsync(createProduct));
productsRouter.post('/:id/comments', withAsync(createComment));
productsRouter.patch('/:id', authenticate.verifyProductAuth, withAsync(updateProduct));
productsRouter.delete('/:id', authenticate.verifyProductAuth, withAsync(deleteProduct));
productsRouter.get('/me', withAsync(getMyProducts));

export default productsRouter;
