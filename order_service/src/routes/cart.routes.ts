import express, { NextFunction, Request, Response } from "express";
import * as service from "../service/cart.service";
import * as repository from "../respository/cart.repository";
import { ValidateRequest } from "../utils/validator";
import {
  CartRequestSchema,
  CreateRequestInput,
  UpdateRequestBodyInput,
  UpdateRequestBodySchema,
} from "../dtos/cartRequest.dto";
import { AuthorizationError, ValidationError } from "../utils/errors";
import { RequestAuthorizer } from "./middleware";

const router = express.Router();
const repo = repository.CartRespository;

router.get(
  "/cart",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        next(new Error("User not found"));
        return;
      }
      const response = await service.GetCart(user.id, repo);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/cart",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        next(new Error("User not found"));
        return;
      }

      const error = ValidateRequest<CreateRequestInput>(
        req.body,
        CartRequestSchema
      );

      if (error) {
        next(new ValidationError("Invalid request inputs."));
      }

      const input: CreateRequestInput = req.body;

      const response = await service.CreateCart(
        {
          ...input,
          customerId: user?.id as number,
        },
        repo
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/cart/:id",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        next(new Error("User not found"));
        return;
      }

      const error = ValidateRequest<UpdateRequestBodyInput>(
        req.body,
        UpdateRequestBodySchema
      );

      if (error) {
        next(new ValidationError("Invalid request inputs."));
      } else {
        const response = await service.UpdateCartItem(
          {
            id: req.body.lineItemId,
            qty: req.body.qty,
            customerId: user.id,
          },
          repo
        );
        console.log("RESPONSE", response);
        res.status(200).json(response);
      }
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/cart/:id",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        next(new Error("User not found"));
        return;
      }
      const liteItemId = req.params.id;

      const response = await service.DeleteCartItem(
        { customerId: user.id, id: +liteItemId },
        repo
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
