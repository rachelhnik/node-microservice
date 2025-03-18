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
exports.OrderRepository = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_connection_1 = require("../db/db.connection");
const schema_1 = require("../db/schema");
const utils_1 = require("../utils");
const createOrder = (lineItem) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_connection_1.DB.insert(schema_1.orders)
        .values({
        customerId: lineItem.customerId,
        orderNumber: lineItem.orderNumber,
        status: lineItem.status,
        txnId: lineItem.txnId,
        amount: lineItem.amount,
    })
        .returning();
    const [{ id }] = result;
    if (id > 0) {
        for (const item of lineItem.orderItems) {
            console.log("item", item);
            yield db_connection_1.DB.insert(schema_1.orderLineItems)
                .values({
                orderId: id,
                itemId: item.productId,
                itemName: item.itemName,
                price: item.price,
                qty: item.qty,
            })
                .execute();
        }
    }
    return id;
});
const findOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield db_connection_1.DB.query.orders.findFirst({
        where: (orders, { eq }) => eq(orders.id, id),
        with: {
            lineItems: true,
        },
    });
    if (!order) {
        throw new utils_1.NotFoundError("Order not found.");
    }
    return order;
});
const findOrderByOrderNumber = (orderNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield db_connection_1.DB.query.orders.findFirst({
        where: (orders, { eq }) => eq(orders.orderNumber, orderNumber),
        with: {
            lineItems: true,
        },
    });
    if (!order) {
        throw new utils_1.NotFoundError("Order not found.");
    }
    console.log("**", order);
    return order;
});
const updateOrder = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_connection_1.DB.update(schema_1.orders)
        .set({
        status: status,
    })
        .where((0, drizzle_orm_1.eq)(schema_1.orders.id, id))
        .execute();
    const order = yield findOrder(id);
    if (!order) {
        throw new utils_1.NotFoundError("Order not found.");
    }
    return order;
});
const updateOrderByOrderNumber = (orderNumber, status) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("HIII", orderNumber, status);
    yield db_connection_1.DB.update(schema_1.orders)
        .set({
        status: status,
    })
        .where((0, drizzle_orm_1.eq)(schema_1.orders.orderNumber, orderNumber))
        .execute();
    return true;
});
const deleteOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield findOrder(id);
    yield db_connection_1.DB.delete(schema_1.orders).where((0, drizzle_orm_1.eq)(schema_1.orders.id, id)).execute();
    return true;
});
const findOrdersByCustomerId = (customerId) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield db_connection_1.DB.query.orders.findMany({
        where: (orders, { eq }) => eq(orders.customerId, customerId),
        with: {
            lineItems: true,
        },
    });
    return orders;
});
exports.OrderRepository = {
    createOrder,
    findOrder,
    findOrderByOrderNumber,
    updateOrder,
    updateOrderByOrderNumber,
    deleteOrder,
    findOrdersByCustomerId,
};
