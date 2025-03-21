import express, { NextFunction, Request, Response } from "express";
import { RequestAuthorizer } from "./middleware";
const router = express.Router();
import * as service from "../service/payment.service";
import { PaymentGateway } from "../types";
import { NotFoundError, StripePayment } from "../utils";

const paymentGateway: PaymentGateway = StripePayment;

router.post(
  "/create-payment",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      next(new NotFoundError(" User not found. "));
      return;
    }
    try {
      const { orderNumber } = req.body;
      const response = await service.CreatePayment(
        user.id,
        orderNumber,
        paymentGateway
      );
      res.status(200).json({ message: "Payment successful.", data: response });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/verify-payment/:id",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      next(new NotFoundError("User not found."));
      return;
    }
    const paymentId = req.params.id;
    if (!paymentId) {
      next(new NotFoundError("Payment Id not found."));
      return;
    }
    try {
      await service.VerifyPayment(paymentId, paymentGateway);
      res.status(200).json({ message: "Payment verification completed." });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
