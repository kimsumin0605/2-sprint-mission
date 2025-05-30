import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import path from 'path';
import dotenv from 'dotenv'; 
import { notFoundHandler, errorHandler } from './utils/asyncHandler.js';

import productRouter from './routes/products.js';
import articleRouter from './routes/articles.js';
import commentRouter from './routes/comments.js';
import uploadRouter from './routes/upload.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev')); 
}

app.use("/products", productRouter);
app.use("/articles", articleRouter);
app.use("/comments", commentRouter);

const __dirname = path.dirname(new URL(import.meta.url).pathname); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/documents', uploadRouter); 

app.use(notFoundHandler); 
app.use(errorHandler); 


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
}
);