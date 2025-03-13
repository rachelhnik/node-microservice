import { NextFunction, Request, Response } from "express";
import { AuthorizationError } from "../utils/errors";
import { validateUser } from "../utils/broker";

export const RequestAuthorizer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .json({ error: "Unauthorized due to authorization token missing!" });
  }

  const userData = await validateUser(req.headers.authorization as string);
  req.user = userData;
  next();
};
