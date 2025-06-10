import express from 'express';
import * as productsController from '../controllers/productsController.js';

const router = express.Router();

// 상품 목록 조회
router
  .route('/')
  .get(productsController.getProducts)  
  .post(productsController.createProduct); 

// 상품 상세 조회, 수정, 삭제
router
  .route('/:id')
  .get(productsController.getProductById)  
  .patch(productsController.updateProduct)  
  .delete(productsController.deleteProduct);  

export default router;