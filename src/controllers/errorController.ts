import { BadRequestError } from "../lib/errors/BadRequestError";
import NotFoundError from "../lib/errors/NotFoundError";
import { Request, Response, ErrorRequestHandler } from "express";

export function defaultNotFoundHandler(req: Request, res: Response): void {
  res.status(404).send({ message: "요청하신 경로를 찾을 수 없습니다." });
}

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
): void => {
  /** From superstruct or application error */
  if (err instanceof BadRequestError) {
    res.status(400).send({ message: err.message });
    return;
  }

  /** From express.json middleware */
  if (
    err instanceof SyntaxError &&
    (err as any).status === 400 &&
    "body" in err
  ) {
    res.status(400).send({ message: "잘못된 JSON 형식입니다." });
    return;
  }

  /** Prisma error codes */
  if ("code" in err) {
    console.error(err);
    res
      .status(500)
      .send({
        message: "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    return;
  }

  /** Application error */
  if (err instanceof NotFoundError) {
    res.status(404).send({ message: err.message });
    return;
  }

  console.error(err);
  res
    .status(500)
    .send({
      message: "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    });
  return;
};
