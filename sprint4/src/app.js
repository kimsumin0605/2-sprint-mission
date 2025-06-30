import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import { PORT, PUBLIC_PATH, STATIC_PATH } from './lib/constants.js';
import articlesRouter from './routers/articlesRouter.js';
import productsRouter from './routers/productsRouter.js';
import commentsRouter from './routers/commentsRouter.js';
import imagesRouter from './routers/imagesRouter.js';
import usersRouter from './routers/usersRouter.js'
import authRouter from './routers/authRouter.js';
import likesRouter from './routers/likesRouter.js';
import { defaultNotFoundHandler, globalErrorHandler } from './controllers/errorController.js';

dotenv.config();
const app = express();

app.use(logger('dev'));

const swaggerSpec = YAML.load('./swagger.yaml');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use(STATIC_PATH, express.static(path.resolve(process.cwd(), PUBLIC_PATH)));

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);
app.use('/articles', articlesRouter);
app.use('/products', productsRouter);
app.use('/images', imagesRouter);
app.use('/likes', likesRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
