"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCartItem = exports.UpdateCartItem = exports.GetCart = exports.CreateCart = void 0;
const broker_1 = require("../utils/broker");
const errors_1 = require("../utils/errors");
const CreateCart = (input, repo) => __awaiter(void 0, void 0, void 0, function* () {
    const productDetail = yield (0, broker_1.getProductDetails)(input.productId);
    if (productDetail.stock < input.qty) {
        throw new Error("Product is insufficient in quantity.");
    }
    const lineItem = yield repo.findCartByProductId(input.customerId, input.productId);
    if (lineItem) {
        return repo.updateCartItem(lineItem.id, lineItem.qty + input.qty);
    }
    return yield repo.createCart(input.customerId, {
        productId: productDetail.id,
        price: productDetail.price.toString(),
        qty: input.qty,
        itemName: productDetail.name,
        variant: productDetail.variant,
    });
});
exports.CreateCart = CreateCart;
const GetCart = (id, repo) => __awaiter(void 0, void 0, void 0, function* () {
    // get customer cart data
    const cart = yield repo.getCart(id);
    if (!cart) {
        throw new errors_1.NotFoundError("Cart does not exist.");
    }
    const lineItems = cart.lineItems;
    if (!lineItems.length) {
        throw new errors_1.NotFoundError("Cart items not found.");
    }
    const stockDetails = yield (0, broker_1.GetStockDetails)(lineItems.map((item) => item.productId));
    if (Array.isArray(stockDetails)) {
        // update stock availability in cart line items
        lineItems.forEach((lineItem) => {
            const stockItem = stockDetails.find((stock) => stock.id === lineItem.productId);
            if (stockItem) {
                lineItem.availability = stockItem.stock;
            }
        });
        // update cart line items
        cart.lineItems = lineItems;
    }
    return cart;
});
exports.GetCart = GetCart;
const AuthorisedCart = (lineItemId, customerId, repo) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield repo.getCart(customerId);
    if (!cart) {
        throw new errors_1.NotFoundError("Cart does not exist.");
    }
    const lineItem = cart.lineItems.find((item) => item.id === lineItemId);
    if (!lineItem) {
        throw new errors_1.AuthorizationError("You are not authorized to edit this cart.");
    }
    return cart;
});
const UpdateCartItem = (input, repo) => __awaiter(void 0, void 0, void 0, function* () {
    const isAuthorizedCart = yield AuthorisedCart(input.id, input.customerId, repo);
    if (isAuthorizedCart) {
        const data = yield repo.updateCartItem(input.id, input.qty);
        return data;
    }
});
exports.UpdateCartItem = UpdateCartItem;
const DeleteCartItem = (input, repo) => __awaiter(void 0, void 0, void 0, function* () {
    const isAuthorizedCart = yield AuthorisedCart(input.id, input.customerId, repo);
    if (isAuthorizedCart) {
        const isTheFinalItem = isAuthorizedCart.lineItems.length === 1;
        const data = yield repo.deleteCartItem(input.id, isAuthorizedCart.id, isTheFinalItem);
        return data;
    }
});
exports.DeleteCartItem = DeleteCartItem;
