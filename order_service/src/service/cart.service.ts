import {
  CartLineItem,
  CreateRequestInput,
  EditRequestInput,
} from "../dtos/cartRequest.dto";
import { CartRepositoryType } from "../respository/cart.repository";

import { getProductDetails, GetStockDetails } from "../utils/broker";
import { AuthorizationError, NotFoundError } from "../utils/errors";

export const CreateCart = async (
  input: CreateRequestInput & { customerId: number },
  repo: CartRepositoryType
) => {
  const productDetail = await getProductDetails(input.productId);

  if (productDetail.stock < input.qty) {
    throw new Error("Product is insufficient in quantity.");
  }

  const lineItem = await repo.findCartByProductId(
    input.customerId,
    input.productId
  );
  if (lineItem) {
    return repo.updateCart(lineItem.id, lineItem.qty + input.qty);
  }

  return await repo.createCart(input.customerId, {
    productId: productDetail.id,
    price: productDetail.price.toString(),
    qty: input.qty,
    itemName: productDetail.name,
    variant: productDetail.variant,
  } as CartLineItem);
};

export const GetCart = async (id: number, repo: CartRepositoryType) => {
  // get customer cart data
  const cart = await repo.getCart(id);

  if (!cart) {
    throw new NotFoundError("cart does not exist");
  }

  const lineItems = cart.lineItems;

  if (!lineItems.length) {
    throw new NotFoundError("cart items not found");
  }

  const stockDetails = await GetStockDetails(
    lineItems.map((item) => item.productId)
  );

  if (Array.isArray(stockDetails)) {
    // update stock availability in cart line items
    lineItems.forEach((lineItem) => {
      const stockItem = stockDetails.find(
        (stock) => stock.id === lineItem.productId
      );
      if (stockItem) {
        lineItem.availability = stockItem.stock;
      }
    });

    // update cart line items
    cart.lineItems = lineItems;
  }

  return cart;
};

const AuthorisedCart = async (
  lineItemId: number,
  customerId: number,
  repo: CartRepositoryType
) => {
  const cart = await repo.getCart(customerId);
  if (!cart) {
    throw new NotFoundError("cart does not exist");
  }
  console.log("line", cart, lineItemId);

  const lineItem = cart.lineItems.find((item) => item.id === lineItemId);
  if (!lineItem) {
    throw new AuthorizationError("you are not authorized to edit this cart");
  }

  return lineItem;
};

export const UpdateCart = async (
  input: EditRequestInput & { customerId: number },
  repo: CartRepositoryType
) => {
  await AuthorisedCart(input.id, input.customerId, repo);
  const data = await repo.updateCart(input.id, input.qty);
  return data;
};

export const DeleteCart = async (
  input: { id: number; customerId: number },
  repo: CartRepositoryType
) => {
  await AuthorisedCart(input.id, input.customerId, repo);
  const data = await repo.deleteCart(input.id);
  return data;
};
