import Stripe from "stripe";
import { PaymentGateway } from "../../types";
import * as cfg from "../../config";

const stripe = new Stripe(cfg.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

const createPayment = async (
  amount: number,
  metadata: { orderNumber: number; userId: number }
): Promise<{
  secret: string;
  pubKey: string;
  amount: number;
}> => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    metadata: metadata,
  });
  return {
    secret: paymentIntent.client_secret as string,
    pubKey: cfg.STRIPE_PUBLISHABLE_KEY as string,
    amount: paymentIntent.amount,
  };
};

const getPayment = async (
  paymentId: string
): Promise<Record<string, unknown>> => {
  const payment = await stripe.paymentIntents.retrieve(paymentId, {});
  console.log("PAYMENT", payment);
  const { status } = payment;
  return { status, paymentLog: payment };
};

export const StripePayment: PaymentGateway = {
  createPayment,
  getPayment,
};
