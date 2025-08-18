import { Request, Response, NextFunction, RequestHandler } from 'express';

export const withAsync = (
  handler: (req: Request, res: Response, next: NextFunction) => void | Promise<void>
): RequestHandler => {
  return (req, res, next) => {
    return Promise.resolve(handler(req, res, next)).catch(next);
  };
};
