import { GetOrderDetails } from "../utils";

export const CreatePayment = async (
  userId: number,
  orderId: number,
  paymentGateway: unknown
) => {
  //get order details from order service
  const orderDetails = await GetOrderDetails(orderId);
  if (orderDetails.customerId !== userId) {
    throw new Error("User is not authorized to create payment.");
  }
  // create a new payment record
  // call payment gateway to create payment
  // return payment secrets
  return {
    secret: "my super secret",
    pubKey: "my super public key",
    amount: 100,
  };
};

export const VerifyPayment = async (
  paymentId: string,
  paymentGatewasy: unknown
) => {
  // call payment gateway to verify payment
  // update order status through message broker
  // return payment status <= not necessary, just for response to frontend
};
