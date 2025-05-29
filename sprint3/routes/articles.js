import express from "express";
import * as articlesController from "../controllers/articlesController.js";

const router = express.Router();

//게시글 목록 조회
router
  .route('/')
  .get(articlesController.getArticles)
  .post(articlesController.createArticle);

  // 게시글 상세 조회, 수정, 삭제
router
  .route('/:id')
  .get(articlesController.getArticleById)
  .patch(articlesController.updateArticle)
  .delete(articlesController.deleteArticle);

export default router;