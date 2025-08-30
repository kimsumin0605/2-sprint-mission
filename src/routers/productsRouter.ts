import express from "express";
import { ProductController } from "../controllers/productsController";
import passport from "passport";

const router = express.Router();
const productController = new ProductController();
const authenticate = passport.authenticate("access-token", { session: false });

router.get("/", productController.getAll);
router.get("/:id", productController.getById);

router.post("/", authenticate, productController.create);
router.patch("/:id", authenticate, productController.update);
router.delete("/:id", authenticate, productController.delete);
router.get("/me/list", authenticate, productController.getMine);

export default router;
