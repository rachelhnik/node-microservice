"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderEvent = void 0;
var OrderEvent;
(function (OrderEvent) {
    OrderEvent["CREATE_ORDER"] = "create-order";
    OrderEvent["CANCEL_ORDER"] = "cancel-order";
    OrderEvent["CREATE_PAYMENT"] = "create-payment";
    OrderEvent["UPDATE_PAYMENT"] = "update-payment";
})(OrderEvent || (exports.OrderEvent = OrderEvent = {}));
