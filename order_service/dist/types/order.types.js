"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatus = exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["PROCESSING"] = "processing";
    OrderStatus["COMPLETED"] = "completed";
    OrderStatus["CANCELLED"] = "cancelled";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["SUCCEEDED"] = "succeeded";
    PaymentStatus["INCOMPLETE"] = "incomplete";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["CANCELLED"] = "cancelled";
    PaymentStatus["UNCAPTURED"] = "uncaptured";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
