import { PaymentGateway } from "../types";
import { GetOrderDetails } from "../utils";
import { SendPaymentUpdateMessage } from "./broker.service";

export const CreatePayment = async (
  userId: number,
  orderNumber: number,
  paymentGateway: PaymentGateway
) => {
  //get order details from order service
  const orderDetails = await GetOrderDetails(orderNumber);
  if (orderDetails.customerId !== userId) {
    throw new Error("User is not authorized to create payment.");
  }
  // console.log("details", orderDetails);
  const amountInCents = orderDetails.amount * 100;
  const orderMetaData = {
    orderNumber: orderDetails.orderNumber,

    userId: userId,
  };

  const paymentResponse = await paymentGateway.createPayment(
    amountInCents,
    orderMetaData
  );
  console.log("res", paymentResponse);
  // create a new payment record
  // call payment gateway to create payment
  // return payment secrets
  return {
    secret: paymentResponse.secret,
    pubKey: paymentResponse.pubKey,
    amount: paymentResponse.amount,
  };
};

export const VerifyPayment = async (
  paymentId: string,
  paymentGateway: PaymentGateway
) => {
  // call payment gateway to verify payment
  const paymentResponse = await paymentGateway.getPayment(paymentId);
  console.log("response", paymentResponse.status, paymentResponse.paymentLog);
  // update order status through message broker
  const response = await SendPaymentUpdateMessage({
    orderNumber: 661948,
    status: paymentResponse.status,
    paymentLog: paymentResponse.paymentLog,
  });
  console.log(">>>", response);
  return {
    message: "Payment verified.",
    status: paymentResponse.status,
    paymentLog: paymentResponse.paymentLog,
  };
  // return payment status <= not necessary, just for response to frontend
};
