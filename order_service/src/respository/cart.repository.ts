import { eq } from "drizzle-orm";
import { DB } from "../db/db.connection";
import { cartLineItems, carts } from "../db/schema";
import { CartLineItem, CartWithLineItems } from "../dtos/cartRequest.dto";
import { NotFoundError } from "../utils/errors";

export type CartRepositoryType = {
  createCart: (customerId: number, lineItem: CartLineItem) => Promise<number>;
  getCart: (id: number) => Promise<CartWithLineItems>;
  updateCartItem: (id: number, qty: number) => Promise<CartLineItem>;
  deleteCartItem: (
    id: number,
    cartId: number,
    isTheFinalItem: boolean
  ) => Promise<Boolean>;
  clearCartData: (id: number) => Promise<Boolean>;
  findCartByProductId: (
    customerId: number,
    productId: number
  ) => Promise<CartLineItem>;
};

const createCart = async (
  customerId: number,
  { itemName, price, productId, qty, variant }: CartLineItem
): Promise<number> => {
  const result = await DB.insert(carts)
    .values({
      customerId: customerId,
    })
    .returning()
    .onConflictDoUpdate({
      target: carts.customerId,
      set: { updatedAt: new Date() },
    });

  const [{ id }] = result;
  if (id > 0) {
    await DB.insert(cartLineItems).values({
      cartId: id,
      productId: productId,
      itemName: itemName,
      price: price,
      qty: qty,
      variant: variant,
    });
  }
  return id;
};
const getCart = async (id: number): Promise<CartWithLineItems> => {
  const cart = await DB.query.carts.findFirst({
    where: (carts, { eq }) => eq(carts.customerId, id),
    with: {
      lineItems: true,
    },
  });

  if (!cart) {
    throw new NotFoundError("Cart not found.");
  }

  return cart;
};
const updateCartItem = async (
  id: number,
  qty: number
): Promise<CartLineItem> => {
  const [cartLineItem] = await DB.update(cartLineItems)
    .set({
      qty: qty,
    })
    .where(eq(cartLineItems.id, id))
    .returning();
  return cartLineItem;
};

const deleteCartItem = async (
  id: number,
  cartId: number,
  isTheFinalItem: boolean
): Promise<boolean> => {
  await DB.delete(cartLineItems).where(eq(cartLineItems.id, id)).returning();
  if (isTheFinalItem) {
    await DB.delete(carts).where(eq(carts.id, cartId)).returning();
  }
  return true;
};

const clearCartData = async (id: number): Promise<boolean> => {
  const a = await DB.delete(carts).where(eq(carts.id, id)).returning();

  return true;
};

const findCartByProductId = async (
  customerId: number,
  productId: number
): Promise<CartLineItem> => {
  const cart = await DB.query.carts.findFirst({
    where: (carts, { eq }) => eq(carts.customerId, customerId),
    with: {
      lineItems: true,
    },
  });

  const lineItem = cart?.lineItems.find((item) => item.productId === productId);

  return lineItem as CartLineItem;
};

export const CartRespository: CartRepositoryType = {
  createCart,
  getCart,
  updateCartItem,
  deleteCartItem,
  clearCartData,
  findCartByProductId,
};
