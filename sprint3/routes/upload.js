import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from '../utils/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const upload = multer({ dest: uploadDir });

router.post('/upload', upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { originalname, filename } = req.file;
  const extension = path.extname(originalname);
  const newFileName = `${Date.now()}_${filename}${extension}`;
  const newFilePath = path.join(uploadDir, newFileName);

  fs.renameSync(req.file.path, newFilePath);

  const file = await db.document.create({
    data: {
      filename: originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${newFileName}`,
    },
  });

  res.json({ message: 'File uploaded successfully', file });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const doc = await db.document.findUnique({ where: { id: Number(req.params.id) } });
  if (!doc) {
    return res.status(404).json({ error: 'File not found' });
  }

  const filePath = path.resolve(uploadDir, doc.url.split('/').pop());
  res.download(filePath, doc.filename);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const doc = await db.document.findUnique({ where: { id: Number(req.params.id) } });
  if (!doc) {
    return res.status(404).json({ error: 'File not found' });
  }

  const filePath = path.resolve(uploadDir, doc.url.split('/').pop());

  await db.document.delete({ where: { id: Number(req.params.id) } });
  await fs.promises.unlink(filePath);

  res.json({ message: 'File deleted successfully' });
}));

export default router;