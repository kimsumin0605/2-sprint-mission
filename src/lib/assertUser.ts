import { Request } from "express";

export function requireUser(req: Request) {
  if (!req.user) {
    const err = new Error('로그인이 필요합니다.');
    (err as any).status(401);
    throw err;
  }
  return req.user;
}