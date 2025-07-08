import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PUBLIC_PATH } from '../lib/constants';
import { BadRequestError } from '../lib/errors/BadRequestError';
import { Request, Response } from 'express';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, PUBLIC_PATH);
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      const filename = `${uuidv4()}${ext}`;
      cb(null, filename);
    },
  }),

  limits: {
    fileSize: FILE_SIZE_LIMIT,
  },

  fileFilter: function (req, file, cb) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      const err = new BadRequestError('Only png, jpeg, and jpg are allowed');
      return cb(err);
    }

    cb(null, true);
  },
});

export async function uploadImage(req: MulterRequest, res: Response): Promise<void> {
  const { file } = req;

  if (!file) {
    res.status(400).json({ message: '파일이 업로드되지 않았습니다' });
    return;
  }
  const host = req.get('host');
  if (!host) {
    res.status(500).json({ message: '호스트 정보를 불러올 수 없습니다' });
    return;
  }
  const protocol = req.protocol
  const url = `${protocol}://${host}/static/${file.filename}`;
  res.json({ url });
  return;
}
