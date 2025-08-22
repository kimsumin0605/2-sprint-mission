import express from "express";
import { CommentController } from "../controllers/commentsController";
import passport from "../middlewares/passport";

const router = express.Router();
const commentController = new CommentController();

router.use(passport.authenticate("access-token", { session: false }));

router.post("/products/:id/comments", commentController.createProductComment);
router.post("/articles/:id/comments", commentController.createArticleComment);
router.get("/comments", commentController.getCommentList);
router.patch("/comments/:id", commentController.updateComment);
router.delete("/comments/:id", commentController.deleteComment);

export default router;
