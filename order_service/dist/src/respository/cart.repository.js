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
exports.CartRespository = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_connection_1 = require("../db/db.connection");
const schema_1 = require("../db/schema");
const errors_1 = require("../utils/errors");
const createCart = (customerId_1, _a) => __awaiter(void 0, [customerId_1, _a], void 0, function* (customerId, { itemName, price, productId, qty, variant }) {
    const result = yield db_connection_1.DB.insert(schema_1.carts)
        .values({
        customerId: customerId,
    })
        .returning()
        .onConflictDoUpdate({
        target: schema_1.carts.customerId,
        set: { updatedAt: new Date() },
    });
    const [{ id }] = result;
    if (id > 0) {
        yield db_connection_1.DB.insert(schema_1.cartLineItems).values({
            cartId: id,
            productId: productId,
            itemName: itemName,
            price: price,
            qty: qty,
            variant: variant,
        });
    }
    return id;
});
const getCart = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield db_connection_1.DB.query.carts.findFirst({
        where: (carts, { eq }) => eq(carts.customerId, id),
        with: {
            lineItems: true,
        },
    });
    if (!cart) {
        throw new errors_1.NotFoundError("Cart not found.");
    }
    return cart;
});
const updateCartItem = (id, qty) => __awaiter(void 0, void 0, void 0, function* () {
    const [cartLineItem] = yield db_connection_1.DB.update(schema_1.cartLineItems)
        .set({
        qty: qty,
    })
        .where((0, drizzle_orm_1.eq)(schema_1.cartLineItems.id, id))
        .returning();
    return cartLineItem;
});
const deleteCartItem = (id, cartId, isTheFinalItem) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_connection_1.DB.delete(schema_1.cartLineItems).where((0, drizzle_orm_1.eq)(schema_1.cartLineItems.id, id)).returning();
    if (isTheFinalItem) {
        yield db_connection_1.DB.delete(schema_1.carts).where((0, drizzle_orm_1.eq)(schema_1.carts.id, cartId)).returning();
    }
    return true;
});
const clearCartData = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const a = yield db_connection_1.DB.delete(schema_1.carts).where((0, drizzle_orm_1.eq)(schema_1.carts.id, id)).returning();
    return true;
});
const findCartByProductId = (customerId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield db_connection_1.DB.query.carts.findFirst({
        where: (carts, { eq }) => eq(carts.customerId, customerId),
        with: {
            lineItems: true,
        },
    });
    const lineItem = cart === null || cart === void 0 ? void 0 : cart.lineItems.find((item) => item.productId === productId);
    return lineItem;
});
exports.CartRespository = {
    createCart,
    getCart,
    updateCartItem,
    deleteCartItem,
    clearCartData,
    findCartByProductId,
};
