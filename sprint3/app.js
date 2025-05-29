import express from 'express';
//import createError from 'http-errors';
//import cors from 'cors';
import logger from 'morgan';
import dotenv from 'dotenv'; 
import {notFoundHandler, errorHandler} from 'utils/asyncHandler.js';

import productRouter from './routes/products.js';
import articleRouter from './routes/articles.js';
import commentRouter from './routes/comments.js';

dotenv.config();

const app = express();

app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev')); 
}

app.use("/product", productRouter);
app.use("/article", articleRouter);
app.use("/comment", commentRouter);

app.use(notFoundHandler); 
app.use(errorHandler); 


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
}
);