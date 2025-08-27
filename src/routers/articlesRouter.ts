import express from "express";
import passport from "../middlewares/passport";
import { ArticleController } from "../controllers/articlesController";

const controller = new ArticleController();
const router = express.Router();

router.post(
  "/",
  passport.authenticate("access-token", { session: false }),
  controller.create
);
router.get("/:id", controller.getOne);
router.get("/", controller.getList);
router.patch(
  "/:id",
  passport.authenticate("access-token", { session: false }),
  controller.update
);
router.delete(
  "/:id",
  passport.authenticate("access-token", { session: false }),
  controller.delete
);

export default router;
