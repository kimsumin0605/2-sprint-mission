export class BadRequestError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
    this.status = 400;
  }
}
export class ConflictError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
    this.status = 409;
  }
}
export class ForbiddenError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
    this.status = 403;
  }
}

export class UnauthorizedError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
    this.status = 401;
  }
}

