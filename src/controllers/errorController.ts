import { BadRequestError } from "../lib/errors/BadRequestError";
import NotFoundError from "../lib/errors/NotFoundError";
import { Request, Response, ErrorRequestHandler } from "express";
import { ValidationError } from "class-validator";
import { ForbiddenError, ConflictError, UnauthorizedError } from "../lib/errors/BadRequestError";

export function defaultNotFoundHandler(req: Request, res: Response): void {
  res.status(404).send({ message: "요청하신 경로를 찾을 수 없습니다." });
}

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next): void => {
  // Prisma error codes
  if ("code" in err) {
    console.error(err);
    res.status(500).send({
      message: "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    });
    return;
  }

  // BadRequestError (400)
  if (err instanceof BadRequestError) {
    res.status(400).send({ message: err.message });
    return;
  }

  // SyntaxError from express.json middleware (Invalid JSON)
  if (err instanceof SyntaxError && (err as any).status === 400 && "body" in err) {
    res.status(400).send({ message: "잘못된 JSON 형식입니다." });
    return;
  }

  // ForbiddenError (403)
  if (err instanceof ForbiddenError) {
    res.status(403).send({ message: err.message });
    return;
  }

  // Validation errors from class-validator
  if (Array.isArray(err) && err[0] instanceof ValidationError) {
    res.status(400).json({
      message: "입력값 검증 실패",
      errors: err,
    });
    return;
  }

  // ConflictError (409)
  if (err instanceof ConflictError) {
    res.status(err.status || 409).json({ message: err.message });
    return;
  }

  // UnauthorizedError (401)
  if (err instanceof UnauthorizedError) {
    res.status(err.status || 401).json({ message: err.message });
    return;
  }

  // NotFoundError (404)
  if (err instanceof NotFoundError) {
    res.status(404).send({ message: err.message });
    return;
  }

  console.error(err);
  res.status(500).send({
    message: "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  });
};
