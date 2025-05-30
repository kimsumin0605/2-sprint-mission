import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from '../utils/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import createError from 'http-errors';

const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const upload = multer({ dest: uploadDir });

router.post('/upload', upload.single('file'), asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(createError(400, 'No file uploaded'));
  }

  const { originalname, filename, mimetype, size } = req.file;
  const extension = path.extname(originalname);
  const newFileName = `${Date.now()}_${filename}${extension}`;
  const newFilePath = path.join(uploadDir, newFileName);

  fs.renameSync(req.file.path, newFilePath);

  const file = await db.document.create({
    data: {
      fileName: originalname,              
      mimeType: mimetype,                  
      size,
      url: `/uploads/${newFileName}`,
    },
  });

  res.json({ message: 'File uploaded successfully', file });
}));

router.post('/upload-by-url', asyncHandler(async (req, res, next) => {
  const { imageUrl } = req.body;
  if (!imageUrl) {
    return next(createError(400, 'imageUrl is required'));
  }

  const response = await fetch(imageUrl);
  if (!response.ok) {
    return next(createError(400, 'Failed to download image'));
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const ext = path.extname(new URL(imageUrl).pathname) || '.jpg';
  const newFileName = `${Date.now()}_downloaded${ext}`;
  const newFilePath = path.join(uploadDir, newFileName);

  await fs.promises.writeFile(newFilePath, buffer);

  const file = await db.document.create({
    data: {
      fileName: newFileName,                          
      mimeType: response.headers.get('content-type') || 'image/jpeg',
      size: buffer.length,
      url: `/uploads/${newFileName}`,
    },
  });

  res.json({ message: 'Image downloaded and saved', file });
}));

router.get('/:id', asyncHandler(async (req, res, next) => {
  const doc = await db.document.findUnique({ where: { id: Number(req.params.id) } });
  if (!doc) {
    return next(createError(404, 'File not found'));
  }

  const filePath = path.resolve(uploadDir, doc.url.split('/').pop());
  res.download(filePath, doc.fileName); 
}));

router.delete('/:id', asyncHandler(async (req, res, next) => {
  const doc = await db.document.findUnique({ where: { id: Number(req.params.id) } });
  if (!doc) {
    return next(createError(404, 'File not found'));
  }

  const filePath = path.resolve(uploadDir, doc.url.split('/').pop());

  await db.document.delete({ where: { id: Number(req.params.id) } });
  await fs.promises.unlink(filePath);

  res.json({ message: 'File deleted successfully' });
}));

export default router;