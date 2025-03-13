export enum CatalogEvent {
  CREATE_ORDER = "create-order",
  CANCEL_ORDER = "cancel-order",
}

export type TOPIC_TYPE = "OrderEvents" | "CatalogEvents";

export interface MessageType {
  headers?: Record<string, any>;
  event: CatalogEvent;
  data: Record<string, any>;
}
