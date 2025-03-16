import { PaymentGateway } from "../types";
import { GetOrderDetails, ValidationError } from "../utils";
import { SendPaymentUpdateMessage } from "./broker.service";

export const CreatePayment = async (
  userId: number,
  orderNumber: number,
  paymentGateway: PaymentGateway
) => {
  //get order details from order service
  const orderDetails = await GetOrderDetails(orderNumber);
  if (orderDetails.customerId !== userId) {
    throw new ValidationError("User is not authorized to create payment.");
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
  const paymentResponse = (await paymentGateway.getPayment(
    paymentId
  )) as unknown as any;

  const metadata = paymentResponse.paymentLog.metadata;
  // update order status through message broker
  await SendPaymentUpdateMessage({
    //orderNumber: +metadata.orderNumber,
    orderNumber: 748956,
    //status: paymentResponse.status,
    status: "cancelled",
    paymentLog: paymentResponse.paymentLog,
  });

  return {
    message: "Payment verified.",
    status: paymentResponse.status,
    paymentLog: paymentResponse.paymentLog,
  };
};
