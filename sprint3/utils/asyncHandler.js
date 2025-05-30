import createError from 'http-errors';
import pkg from '@prisma/client';

const { PrismaClientKnownRequestError, PrismaClientValidationError, PrismaClientUnknownRequestError } = pkg;

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const notFoundHandler = (req, res, next) => {
  next(createError(404, 'Not Found'));
};

const errorHandler = (err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
    return res.status(404).send({ message: 'Resource not found' });
  }

  if (err instanceof PrismaClientValidationError) {
    return res.status(400).send({ message: 'Invalid request data', details: err.message });
  }

  if (err instanceof PrismaClientUnknownRequestError) {
    return res.status(500).send({ message: 'Internal server error', details: err.message });
  }

  res.status(err.status || 500).send({ message: err.message });
};

export { asyncHandler, notFoundHandler, errorHandler };
