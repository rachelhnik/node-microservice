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
exports.BrokerService = void 0;
const broker_1 = require("../utils/broker");
class BrokerService {
    constructor(catalogService) {
        this.producer = null;
        this.consumer = null;
        this.catalogService = catalogService;
    }
    initializeBroker() {
        return __awaiter(this, void 0, void 0, function* () {
            this.producer = yield broker_1.MessageBroker.connectProducer();
            this.producer.on("producer.connect", () => __awaiter(this, void 0, void 0, function* () {
                console.log("Catalog Service Producer connected successfully");
            }));
            this.consumer = yield broker_1.MessageBroker.connectConsumer();
            this.consumer.on("consumer.connect", () => __awaiter(this, void 0, void 0, function* () {
                console.log("Catalog Service Consumer connected successfully");
            }));
            // keep listening to consumers events
            // perform the action based on the event
            yield broker_1.MessageBroker.subscribe(this.catalogService.handleBrokerMessage.bind(this.catalogService), "CatalogEvents");
        });
    }
    sendDeleteProductMessage(data) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.BrokerService = BrokerService;
