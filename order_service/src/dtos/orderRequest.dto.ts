import { Static, Type } from "@sinclair/typebox";
import { OrderStatus } from "../types/order.types";

export type OrderLineItemType = {
  id?: number;
  productId: number;
  itemName: string;
  qty: number;
  price: string;
  itemId?: number;
  orderId?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface OrderWithLineItems {
  id?: number;
  orderNumber: number;
  customerId: number;

  amount: string;
  status: string;
  txnId: string | null;
  orderItems: OrderLineItemType[];
  lineItems?: OrderLineItemType[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InProcessOrder {
  id?: number;
  orderNumber: number;
  customerId: number;
  status: string;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const OrderUpdateSchema = Type.Object({
  status: Type.Enum(OrderStatus),
});

export type OrderUpdateInput = Static<typeof OrderUpdateSchema>;
