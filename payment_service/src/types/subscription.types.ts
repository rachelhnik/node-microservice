export enum PaymentEvent {
  CREATE_PAYMENT = "create-payment",
  UPDATE_PAYMENT = "update-payment",
}

export type TOPIC_TYPE = "OrderEvents";

export interface MessageType {
  headers?: Record<string, any>;
  event: PaymentEvent;
  data: Record<string, any>;
}
