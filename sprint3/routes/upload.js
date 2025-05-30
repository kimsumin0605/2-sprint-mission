import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {db} from '../db.js';

const router = express.Router();

// 업로드 폴더 경로 설정
const uploadDir = path.join(__dirname, '../uploads');

// 업로드 폴더가 없으면 생성
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer 설정: 업로드된 파일을 uploads 폴더로 저장
const upload = multer({ dest: uploadDir });

// 파일 업로드 (POST /documents/upload)
router.post('/upload', upload.single('file'), async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { originalname, filename } = req.file;
  const extension = path.extname(originalname);
  const newFileName = filename + extension;
  const newFilePath = path.join(uploadDir, newFileName);

  // 파일명을 변경하고 새로운 경로로 파일 이동
  fs.renameSync(req.file.path, newFilePath);

  try {
    // DB에 파일 정보 저장
    const file = await db.document.create({
      data: {
        filename: originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: `/uploads/${newFileName}`, // 클라이언트가 접근할 수 있는 URL
      },
    });
    res.json({ message: 'File uploaded successfully', file });
  } catch (err) {
    next(err);  // 에러 발생 시 에러 핸들러로 전달
  }
});

// 파일 다운로드 (GET /documents/download/:id)
router.get('/download/:id', async (req, res, next) => {
  try {
    const doc = await db.document.findUnique({ where: { id: Number(req.params.id) } });
    if (!doc) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filePath = path.resolve(__dirname, '../uploads', doc.url.split('/').pop());
    res.download(filePath, doc.filename);
  } catch (err) {
    next(err);  // 에러 발생 시 에러 핸들러로 전달
  }
});

// 파일 삭제 (DELETE /documents/:id)
router.delete('/:id', async (req, res, next) => {
  try {
    const doc = await db.document.findUnique({ where: { id: Number(req.params.id) } });
    if (!doc) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filePath = path.resolve(__dirname, '../uploads', doc.url.split('/').pop());
    
    // DB에서 파일 정보 삭제 후, 파일 시스템에서 파일 삭제
    await db.document.delete({ where: { id: Number(req.params.id) } });
    await fs.promises.unlink(filePath);

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    next(err);  // 에러 발생 시 에러 핸들러로 전달
  }
});
  
export default router;