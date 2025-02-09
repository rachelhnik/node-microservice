export enum OrderEvent {
  CREATE_ORDER = "create-order",
  CANCEL_ORDER = "cancel-order",
}

export type TOPIC_TYPE = "OrderEvents" | "CatalogEvents";

export interface MessageType {
  headers?: Record<string, any>;
  event: OrderEvent;
  data: Record<string, any>;
}
