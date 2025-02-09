import { STATUS_CODES } from "./status-codes";

class BaseError extends Error {
  public readonly name: string;
  public readonly status: number;
  public readonly error: string;

  constructor(name: string, status: number, description: string) {
    super(description);
    this.name = name;
    this.status = status;
    this.error = description;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

export class APIError extends BaseError {
  constructor(description = "api error") {
    super(
      "api internal server error",
      STATUS_CODES.INTERNAL_ERROR,
      description
    );
  }
}

export class ValidationError extends BaseError {
  constructor(description = "bad request") {
    super("bad request", STATUS_CODES.BAD_REQUEST, description);
  }
}

export class AuthorizationError extends BaseError {
  constructor(description = "access denied") {
    super("access denied", STATUS_CODES.UNAUTHORIZED, description);
  }
}

export class NotFoundError extends BaseError {
  constructor(description = "not found") {
    super("not found", STATUS_CODES.NOT_FOUND, description);
  }
}
