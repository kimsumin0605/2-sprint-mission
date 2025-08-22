import express from "express";
import { ProductController } from "../controllers/productsController";
import passport from "../middlewares/passport";

const router = express.Router();
const productController = new ProductController();

router.get("/", productController.getAll);
router.get("/:id", productController.getById);

router.use(passport.authenticate("access-token", { session: false }));

router.post("/", productController.create);
router.patch("/:id", productController.update);
router.delete("/:id", productController.delete);
router.get("/me/list", productController.getMine);

export default router;
