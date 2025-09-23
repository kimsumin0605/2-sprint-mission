import { Request, Response } from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3 } from '@aws-sdk/client-s3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestError } from '../lib/errors/BadRequestError';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

// AWS S3 설정
const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_REGION,
});

const isProduction = process.env.NODE_ENV === 'production';

export class ImageController {
  public upload = multer({
    storage: isProduction
      ? multerS3({
          s3,
          bucket: process.env.AWS_S3_BUCKET_NAME!,
          acl: 'public-read',
          contentType: multerS3.AUTO_CONTENT_TYPE,
          key: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const filename = `${uuidv4()}${ext}`;
            cb(null, filename);
          },
        })
      : multer.diskStorage({
          destination: (req, file, cb) => {
            cb(null, 'public');
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
        return cb(new BadRequestError('허용된 파일 형식이 아닙니다'));
      }
      cb(null, true);
    },
  });

  public uploadImage = async (req: Request, res: Response): Promise<void> => {
    const file = req.file as Express.Multer.File & { location?: string };

    if (!file) {
      throw new BadRequestError('파일이 업로드되지 않았습니다');
    }

    const url = isProduction
      ? file.location 
      : `${req.protocol}://${req.get('host')}/static/${file.filename}`; 

    res.json({ url });
  };
}
