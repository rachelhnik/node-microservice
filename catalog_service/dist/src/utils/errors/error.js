"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.AuthorizationError = exports.ValidationError = exports.APIError = void 0;
const status_codes_1 = require("./status-codes");
class BaseError extends Error {
    constructor(name, status, description) {
        super(description);
        this.name = name;
        this.status = status;
        this.error = description;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}
class APIError extends BaseError {
    constructor(description = "api error") {
        super("api internal server error", status_codes_1.STATUS_CODES.INTERNAL_ERROR, description);
    }
}
exports.APIError = APIError;
class ValidationError extends BaseError {
    constructor(description = "bad request") {
        super("bad request", status_codes_1.STATUS_CODES.BAD_REQUEST, description);
    }
}
exports.ValidationError = ValidationError;
class AuthorizationError extends BaseError {
    constructor(description = "access denied") {
        super("access denied", status_codes_1.STATUS_CODES.UNAUTHORIZED, description);
    }
}
exports.AuthorizationError = AuthorizationError;
class NotFoundError extends BaseError {
    constructor(description = "not found") {
        super("not found", status_codes_1.STATUS_CODES.NOT_FOUND, description);
    }
}
exports.NotFoundError = NotFoundError;
