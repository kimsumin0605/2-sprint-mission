import express from 'express';
//import createError from 'http-errors';
//import cors from 'cors';
import logger from 'morgan';
import {notFoundHandler, errorHandler} from 'utils/asyncHandler.js';

import productRouter from './routes/products.js';
import articleRouter from './routes/articles.js';
import commentRouter from './routes/comments.js';

const app = express();
app.use(express.json());

app.use("/product", productRouter);
app.use("/article", articleRouter);
app.use("/comment", commentRouter);

app.use(notFoundHandler); // 404 에러 핸들러
app.use(errorHandler); // 일반 에러 핸들러


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
}
);