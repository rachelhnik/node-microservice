import { logger } from "../logger";
import { AuthorizationError, NotFoundError, ValidationError } from "./error";

import { Request, Response, NextFunction } from "express";

// Error-handling middleware
export const HandleErrorWithLogger = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
): Response => {
  let reportError = true;
  let status = 500;
  let data = error.message;

  [NotFoundError, ValidationError, AuthorizationError].forEach(
    (typeOfError) => {
      if (error instanceof typeOfError) {
        console.log("ERROR", error);
        reportError = false;
        status = (error as any).status; // Ensure `status` is properly typed
        data = error.message;
      }
    }
  );

  if (reportError) {
    logger.error(error);
  } else {
    logger.warn(error);
  }

  return response.status(status).json({ error: data });
};

export const HandleUncaughtException = (error: Error) => {
  logger.error(error);
  process.exit(1);
};
