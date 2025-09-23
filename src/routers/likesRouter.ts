import express from "express";
import { LikeController } from "../controllers/likeController";
import { verifyAccessToken } from "../middlewares/passport";

const likesRouter = express.Router();
const likeController = new LikeController();

likesRouter.use(verifyAccessToken);

likesRouter.post("/articles/:id", likeController.toggleArticleLike);
likesRouter.post("/products/:id", likeController.toggleProductLike);
likesRouter.get("/products", likeController.getLikedProducts);
likesRouter.get("/articles", likeController.getLikedArticles);

export default likesRouter;
