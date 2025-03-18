"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderUpdateSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const order_types_1 = require("../types/order.types");
exports.OrderUpdateSchema = typebox_1.Type.Object({
    status: typebox_1.Type.Enum(order_types_1.OrderStatus),
});
