import { Static, Type } from "@sinclair/typebox";

export const CartRequestSchema = Type.Object({
  productId: Type.Integer(),
  qty: Type.Integer({ minimum: 1 }),
});

export type CreateRequestInput = Static<typeof CartRequestSchema>;

export const EditRequestSchema = Type.Object({
  id: Type.Integer(),
  qty: Type.Integer(),
});

export type EditRequestInput = Static<typeof EditRequestSchema>;

export const UpdateRequestBodySchema = Type.Object({
  qty: Type.Integer(),
  lineItemId: Type.Integer(),
});

export type UpdateRequestBodyInput = Static<typeof UpdateRequestBodySchema>;

export type CartLineItem = {
  id: number;
  productId: number;
  itemName: string;
  price: string;
  qty: number;
  variant: string | null;
  createdAt: Date;
  updatedAt: Date;
  availability?: number;
};

export interface CartWithLineItems {
  id: number;
  customerId: number;
  lineItems: CartLineItem[];
  createdAt: Date;
  updatedAt: Date;
}
