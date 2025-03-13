import express, { NextFunction, Request, Response } from "express";
import { MessageBroker } from "../utils/broker";
import { OrderEvent } from "../types";
import { OrderRepository } from "../respository/order.repository";
import { CartRespository } from "../respository/cart.repository";
import { RequestAuthorizer } from "./middleware";
import * as service from "../service/order.service";
import { OrderStatus } from "../types/order.types";
import { ValidateRequest, ValidationError } from "../utils";
import { OrderUpdateInput, OrderUpdateSchema } from "../dtos/orderRequest.dto";

const repo = OrderRepository;
const cartRepo = CartRespository;
const router = express.Router();

router.get(
  "/orders",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        next(new Error("User not found"));
        return;
      }

      const response = await service.GetOrders(user.id, repo);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/orders/:id",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        next(new Error("User not found"));
        return;
      }
      const response = await service.GetOrder(parseInt(req.params.id), repo);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/orders",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        next(new Error("User not found"));
        return;
      }
      // await MessageBroker.publish({
      //   topic: "OrderEvents",
      //   headers: { correlationId: "12345", timestamp: new Date().toISOString() },
      //   event: OrderEvent.CREATE_ORDER,
      //   message: {
      //     orderId: 1,
      //     items: [
      //       {
      //         productId: 1,
      //         quantity: 1,
      //       },
      //       {
      //         productId: 2,
      //         quantity: 2,
      //       },
      //     ],
      //   },
      // });
      const response = await service.CreateOrder(user.id, repo, cartRepo);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/orders/:id",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        next(new Error("User not found"));
        return;
      }
      const error = ValidateRequest<OrderUpdateInput>(
        req.body,
        OrderUpdateSchema
      );

      if (error) {
        next(new ValidationError("Invalid request inputs."));
      } else {
        const orderId = parseInt(req.params.id);
        const status = req.body.status as OrderStatus;
        const response = await service.UpdateOrder(orderId, status, repo);
        res.status(200).json(response);
      }
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/orders/:id",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        next(new Error("User not found"));
        return;
      }
      const orderId = parseInt(req.params.id);
      const response = await service.DeleteOrder(orderId, repo);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/orders/:id/checkout",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderNumber = Number(req.params.id);
      const orderDetails = await service.CheckoutOrder(orderNumber, repo);
      res.status(200).json(orderDetails);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
