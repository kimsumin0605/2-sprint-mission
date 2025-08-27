import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import articlesRouter from './routers/articlesRouter';
import productsRouter from './routers/productsRouter';
import commentsRouter from './routers/commentsRouter';
import imagesRouter from './routers/imagesRouter';
import usersRouter from './routers/usersRouter'
import authRouter from './routers/authRouter';
import likesRouter from './routers/likesRouter';
import notificationRouter from './routers/notificationRouter';
import { defaultNotFoundHandler, globalErrorHandler } from './controllers/errorController';

dotenv.config();
const app = express();

app.use(logger('dev'));

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use('/static', express.static(path.resolve(process.cwd())));

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);
app.use('/articles', articlesRouter);
app.use('/products', productsRouter);
app.use('/images', imagesRouter);
app.use('/likes', likesRouter);
app.use('/notifications', notificationRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

export default app;
