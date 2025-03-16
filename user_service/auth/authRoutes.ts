import express, { NextFunction, Request, Response } from "express";
import { RequestValidator } from "../utils/request-validator";
import {
  CreateUserRequest,
  LoginUserRequest,
  LogoutUserRequest,
} from "./dtos/AuthRequest.dto";
import { APIError, AuthorizationError, ValidationError } from "../utils";
import {
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  validateUser,
} from "./authService";

require("dotenv").config();

const router = express.Router();

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { errors, input } = await RequestValidator(
        CreateUserRequest,
        req.body
      );
      if (errors) {
        next(new ValidationError("Invalid request."));
      }
      const user = await registerUser(req.body);

      if (user) {
        res.status(200).send(user);
      } else {
        next(new APIError("Something went wrong."));
      }
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { errors, input } = await RequestValidator(
        LoginUserRequest,
        req.body
      );
      if (errors) {
        next(new ValidationError("Invalid request."));
      }
      const tokenData = await loginUser(req.body);
      if (tokenData) {
        return res.status(200).json({ message: "Login successful", tokenData });
      } else {
        next(new APIError("Something went wrong."));
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/logout",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const token = req.headers["authorization"] as string;
      const data = await logoutUser(token);
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  }
);
router.post(
  "/refresh-token",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refresh_token } = req.body;

      const data = await refreshToken(refresh_token);
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/validate",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const token = req.headers["authorization"];

      if (!token) {
        return next(new AuthorizationError("Unauthorized."));
      }

      try {
        const user = await validateUser(token);

        return res.status(200).json(user);
      } catch (error) {
        return res.status(403).json({ message: "Invalid token00000" });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
