"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleUncaughtException = exports.HandleErrorWithLogger = void 0;
const logger_1 = require("../logger");
const error_1 = require("./error");
// Error-handling middleware
const HandleErrorWithLogger = (error, request, response, next) => {
    let reportError = true;
    let status = 500;
    let data = error.message;
    [error_1.NotFoundError, error_1.ValidationError, error_1.AuthorizationError].forEach((typeOfError) => {
        if (error instanceof typeOfError) {
            console.log("ERROR", error);
            reportError = false;
            status = error.status; // Ensure `status` is properly typed
            data = error.message;
        }
    });
    if (reportError) {
        logger_1.logger.error(error);
    }
    else {
        logger_1.logger.warn(error);
    }
    return response.status(status).json({ error: data });
};
exports.HandleErrorWithLogger = HandleErrorWithLogger;
const HandleUncaughtException = (error) => {
    logger_1.logger.error(error);
    process.exit(1);
};
exports.HandleUncaughtException = HandleUncaughtException;
