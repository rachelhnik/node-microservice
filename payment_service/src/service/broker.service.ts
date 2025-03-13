import { Consumer, Producer } from "kafkajs";
import { MessageBroker } from "../utils";
import { PaymentEvent } from "../types";

// initilize the broker
export const InitializeBroker = async () => {
  const producer = await MessageBroker.connectProducer<Producer>();
  producer.on("producer.connect", async () => {
    console.log("Producer connected successfully");
  });
};

// publish dedicated events based on usecases
export const SendPaymentUpdateMessage = async (data: any) => {
  await MessageBroker.publish({
    event: PaymentEvent.CREATE_PAYMENT,
    topic: "OrderEvents",
    headers: {},
    message: data,
  });
};
