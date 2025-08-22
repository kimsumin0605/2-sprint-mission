import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { BadRequestError } from "../lib/errors/BadRequestError";

const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

export class ImageController {
  public upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "/static");
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${uuidv4()}${ext}`;
        cb(null, filename);
      },
    }),
    limits: {
      fileSize: FILE_SIZE_LIMIT,
    },
    fileFilter: (req, file, cb) => {
      if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return cb(new BadRequestError("Only png, jpeg, and jpg are allowed"));
      }
      cb(null, true);
    },
  });

  public uploadImage = async (req: Request, res: Response): Promise<void> => {
    const file = req.file;
    if (!file) {
      res.status(400).json({ message: "파일이 업로드되지 않았습니다" });
      return;
    }

    const host = req.get("host");
    if (!host) {
      res.status(500).json({ message: "호스트 정보를 불러올 수 없습니다" });
      return;
    }

    const url = `${req.protocol}://${host}/static/${file.filename}`;
    res.json({ url });
  };
}
