import { StructError } from 'superstruct';
import BadRequestError from '../lib/errors/BadRequestError.js';
import NotFoundError from '../lib/errors/NotFoundError.js';

export function defaultNotFoundHandler(req, res, next) {
  return res.status(404).send({ message: '요청하신 경로를 찾을 수 없습니다.' });
}

export function globalErrorHandler(err, req, res, next) {
  /** From superstruct or application error */
  if (err instanceof StructError || err instanceof BadRequestError) {
    return res.status(400).send({ message: err.message });
  }

  /** From express.json middleware */
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).send({ message: '잘못된 JSON 형식입니다.' });
  }

  /** Prisma error codes */
  if (err.code) {
    console.error(err);
    return res.status(500).send({ message: '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
  }

  /** Application error */
  if (err instanceof NotFoundError) {
    return res.status(404).send({ message: err.message });
  }

  console.error(err);
  return res.status(500).send({ message:'서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'});
}
