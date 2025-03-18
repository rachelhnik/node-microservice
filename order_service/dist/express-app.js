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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const logger_1 = require("./utils/logger");
const errors_1 = require("./utils/errors");
const broker_service_1 = require("./service/broker.service");
const ExpressApp = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use(logger_1.httpLogger);
    yield (0, broker_service_1.InitializeBroker)();
    app.use(order_routes_1.default);
    app.use(cart_routes_1.default);
    app.use("/", (req, res, _) => {
        res.status(200).json({ message: "I am healthy." });
    });
    app.use(errors_1.HandleErrorWithLogger);
    return app;
});
exports.ExpressApp = ExpressApp;
