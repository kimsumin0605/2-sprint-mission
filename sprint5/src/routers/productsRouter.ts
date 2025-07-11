import express from 'express';
import { withAsync } from '../lib/withAsync';
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductList,
  getMyProducts,
} from '../controllers/productsController';
import { verifyAccessToken } from '../middlewares/passport';

const productsRouter = express.Router();

productsRouter.get('/', withAsync(getProductList));
productsRouter.get('/:id', withAsync(getProduct));

productsRouter.use(verifyAccessToken);

productsRouter.post('/', withAsync(createProduct));
productsRouter.patch('/:id', withAsync(updateProduct));
productsRouter.delete('/:id', withAsync(deleteProduct));
productsRouter.get('/me', withAsync(getMyProducts));

export default productsRouter;
