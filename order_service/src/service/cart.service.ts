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
    return repo.updateCartItem(lineItem.id, lineItem.qty + input.qty);
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
    throw new NotFoundError("Cart does not exist.");
  }

  const lineItems = cart.lineItems;

  if (!lineItems.length) {
    throw new NotFoundError("Cart items not found.");
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
    throw new NotFoundError("Cart does not exist.");
  }

  const lineItem = cart.lineItems.find((item) => item.id === lineItemId);

  if (!lineItem) {
    throw new AuthorizationError("You are not authorized to edit this cart.");
  }

  return cart;
};

export const UpdateCartItem = async (
  input: EditRequestInput & { customerId: number },
  repo: CartRepositoryType
) => {
  const isAuthorizedCart = await AuthorisedCart(
    input.id,
    input.customerId,
    repo
  );
  if (isAuthorizedCart) {
    const data = await repo.updateCartItem(input.id, input.qty);
    return data;
  }
};

export const DeleteCartItem = async (
  input: { id: number; customerId: number },
  repo: CartRepositoryType
) => {
  const isAuthorizedCart = await AuthorisedCart(
    input.id,
    input.customerId,
    repo
  );
  if (isAuthorizedCart) {
    const isTheFinalItem = isAuthorizedCart.lineItems.length === 1;
    const data = await repo.deleteCartItem(
      input.id,
      isAuthorizedCart.id,
      isTheFinalItem
    );
    return data;
  }
};
