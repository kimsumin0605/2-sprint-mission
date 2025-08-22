import express from "express";
import { ImageController } from "../controllers/imagesController";

const imageController = new ImageController();
const imagesRouter = express.Router();

imagesRouter.post(
  "/upload",
  imageController.upload.single("image"),
  imageController.uploadImage
);

export default imagesRouter;
