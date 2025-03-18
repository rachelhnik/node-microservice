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
exports.CheckoutOrder = exports.HandleSubscription = exports.DeleteOrder = exports.GetOrders = exports.GetOrder = exports.UpdateOrder = exports.CreateOrder = void 0;
const order_repository_1 = require("../respository/order.repository");
const order_types_1 = require("../types/order.types");
const types_1 = require("../types");
const broker_service_1 = require("./broker.service");
const utils_1 = require("../utils");
const orderRepo = order_repository_1.OrderRepository;
const CreateOrder = (userId, repo, cartRepo) => __awaiter(void 0, void 0, void 0, function* () {
    // find cart by customer id
    const cart = yield cartRepo.getCart(userId);
    if (!cart) {
        throw new utils_1.NotFoundError("Cart not found.");
    }
    // calculate total ordre amount
    let cartTotal = 0;
    let orderLineItems = [];
    const itemIds = cart.lineItems.map((item) => item.productId);
    const stockData = yield (0, utils_1.GetStockDetails)(itemIds);
    // create orderline items from cart items
    cart.lineItems.forEach((item) => {
        const stockItemData = stockData.find((itemdata) => itemdata.id == item.productId);
        if (stockItemData && (stockItemData === null || stockItemData === void 0 ? void 0 : stockItemData.stock) < item.qty) {
            throw new Error(`Only ${stockItemData.stock} items left for ${stockItemData.name}.`);
        }
        cartTotal += item.qty * Number(item.price);
        orderLineItems.push({
            productId: item.productId,
            itemName: item.itemName,
            qty: item.qty,
            price: item.price,
        });
    });
    const orderNumber = Math.floor(Math.random() * 1000000);
    // create order with line items
    const orderInput = {
        orderNumber: orderNumber,
        txnId: null,
        status: order_types_1.OrderStatus.PENDING,
        customerId: userId,
        amount: cartTotal.toString(),
        orderItems: orderLineItems,
    };
    yield repo.createOrder(orderInput);
    yield cartRepo.clearCartData(cart.id);
    //event sent to catalog service to update stock
    yield (0, broker_service_1.SendCreateOrderMessage)(orderInput);
    // return success message
    return { message: "Order created successfully", orderNumber: orderNumber };
});
exports.CreateOrder = CreateOrder;
const UpdateOrder = (orderId, status, repo) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const orderData = yield repo.updateOrder(orderId, status);
    if (status === order_types_1.OrderStatus.CANCELLED) {
        const data = (_a = orderData === null || orderData === void 0 ? void 0 : orderData.lineItems) === null || _a === void 0 ? void 0 : _a.map((item) => {
            return { id: item.productId, stock: item.qty };
        });
        yield (0, broker_service_1.SendOrderCanceledMessage)(data);
    }
    return { message: "Order updated successfully" };
});
exports.UpdateOrder = UpdateOrder;
const GetOrder = (orderId, repo) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield repo.findOrder(orderId);
    if (!order) {
        throw new utils_1.NotFoundError("Order not found.");
    }
    return order;
});
exports.GetOrder = GetOrder;
const GetOrders = (userId, repo) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield repo.findOrdersByCustomerId(userId);
    if (!Array.isArray(orders)) {
        throw new utils_1.NotFoundError("Orders not found.");
    }
    return orders;
});
exports.GetOrders = GetOrders;
const DeleteOrder = (orderId, repo) => __awaiter(void 0, void 0, void 0, function* () {
    return yield repo.deleteOrder(orderId);
});
exports.DeleteOrder = DeleteOrder;
const HandleSubscription = (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (message.event === types_1.OrderEvent.CREATE_PAYMENT) {
        switch (message.data.status) {
            case order_types_1.PaymentStatus.SUCCEEDED:
                yield orderRepo.updateOrderByOrderNumber(message.data.orderNumber, order_types_1.OrderStatus.COMPLETED);
                break;
            case order_types_1.PaymentStatus.CANCELLED:
                yield orderRepo.updateOrderByOrderNumber(message.data.orderNumber, order_types_1.OrderStatus.CANCELLED);
                const orderData = yield orderRepo.findOrderByOrderNumber(message.data.orderNumber);
                const data = (_a = orderData === null || orderData === void 0 ? void 0 : orderData.lineItems) === null || _a === void 0 ? void 0 : _a.map((item) => {
                    return { id: item.itemId, stock: item.qty };
                });
                //event sent to catalog service to update stock
                yield (0, broker_service_1.SendOrderCanceledMessage)(data);
                break;
            default:
                break;
        }
    }
    // call create order
});
exports.HandleSubscription = HandleSubscription;
const CheckoutOrder = (orderNumber, repo) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield repo.findOrderByOrderNumber(orderNumber);
    if (!order) {
        throw new utils_1.NotFoundError("Order not found.");
    }
    const checkoutOrder = {
        id: Number(order === null || order === void 0 ? void 0 : order.id),
        orderNumber: order.orderNumber,
        customerId: order.customerId,
        status: order.status,
        amount: Number(order.amount),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
    };
    return checkoutOrder;
});
exports.CheckoutOrder = CheckoutOrder;
