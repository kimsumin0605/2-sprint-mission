import createError from 'http-errors';
import { Prisma } from '@prisma/client';

// 기본 에러 핸들러 미들웨어
const notFoundHandler = (req, res, next) => {
  next(createError(404, 'Not Found'));  // 404 - 요청한 리소스를 찾을 수 없을 때
};

// 에러 처리 미들웨어
const errorHandler = (err, req, res, next) => {
  // 기본적인 에러 처리
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};  // 개발 환경에서 더 자세한 에러 정보 표시

  // 상황에 맞는 에러 상태 코드 설정
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
    // Prisma에서 404 에러를 나타내는 코드 (예: 존재하지 않는 데이터를 요청할 때)
    return res.status(404).send({ message: 'Resource not found' });
  }

  if (err.name === 'StructError' || err instanceof Prisma.PrismaClientValidationError) {
    // 사용자의 입력 오류 (예: validation 실패)
    return res.status(400).send({ message: 'Invalid request data', details: err.message });
  }

  // PrismaClientUnknownRequestError와 같은 오류는 500으로 처리
  if (err instanceof Prisma.PrismaClientUnknownRequestError || err instanceof Prisma.PrismaClientValidationError) {
    return res.status(500).send({ message: 'Internal server error', details: err.message });
  }

  // 기본적인 500 에러 처리
  res.status(err.status || 500).send({ message: err.message });
};

export { notFoundHandler, errorHandler };