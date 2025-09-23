import express from "express";
import passport from "../middlewares/passport";
import { ArticleController } from "../controllers/articlesController";

const controller = new ArticleController();
const router = express.Router();

const authenticate = passport.authenticate("access-token", { session: false });

router.get("/:id", controller.getOne);
router.get("/", controller.getList);

router.post("/", authenticate, controller.create);
router.patch("/:id", authenticate, controller.update);
router.delete("/:id", authenticate, controller.delete);

export default router;
