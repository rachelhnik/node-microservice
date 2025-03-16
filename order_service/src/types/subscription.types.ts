export enum OrderEvent {
  CREATE_ORDER = "create-order",
  CANCEL_ORDER = "cancel-order",
  CREATE_PAYMENT = "create-payment",
  UPDATE_PAYMENT = "update-payment",
}

export type TOPIC_TYPE = "OrderEvents" | "CatalogEvents" | "PaymentEvents";

export interface MessageType {
  headers?: Record<string, any>;
  event: OrderEvent;
  data: Record<string, any>;
}
