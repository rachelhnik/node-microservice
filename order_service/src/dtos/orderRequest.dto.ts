export type OrderLineItemType = {
  id?: number;
  productId: number;
  itemName: string;
  qty: number;
  price: string;
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
