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
exports.SendOrderCanceledMessage = exports.SendCreateOrderMessage = exports.InitializeBroker = void 0;
const utils_1 = require("../utils");
const order_service_1 = require("./order.service");
const types_1 = require("../types");
// initilize the broker
const InitializeBroker = () => __awaiter(void 0, void 0, void 0, function* () {
    const producer = yield utils_1.MessageBroker.connectProducer();
    producer.on("producer.connect", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Order Service Producer connected successfully");
    }));
    const consumer = yield utils_1.MessageBroker.connectConsumer();
    consumer.on("consumer.connect", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Order Service Consumer connected successfully");
    }));
    // keep listening to consumers events
    // perform the action based on the event
    yield utils_1.MessageBroker.subscribe(order_service_1.HandleSubscription, "OrderEvents");
});
exports.InitializeBroker = InitializeBroker;
// publish dedicated events based on usecases
const SendCreateOrderMessage = (data) => __awaiter(void 0, void 0, void 0, function* () {
    yield utils_1.MessageBroker.publish({
        event: types_1.OrderEvent.CREATE_ORDER,
        topic: "CatalogEvents",
        headers: {},
        message: data,
    });
});
exports.SendCreateOrderMessage = SendCreateOrderMessage;
const SendOrderCanceledMessage = (data) => __awaiter(void 0, void 0, void 0, function* () {
    yield utils_1.MessageBroker.publish({
        event: types_1.OrderEvent.CANCEL_ORDER,
        topic: "CatalogEvents",
        headers: {},
        message: data,
    });
});
exports.SendOrderCanceledMessage = SendOrderCanceledMessage;
