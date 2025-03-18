"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const order_repository_1 = require("../respository/order.repository");
const cart_repository_1 = require("../respository/cart.repository");
const middleware_1 = require("./middleware");
const service = __importStar(require("../service/order.service"));
const utils_1 = require("../utils");
const orderRequest_dto_1 = require("../dtos/orderRequest.dto");
const repo = order_repository_1.OrderRepository;
const cartRepo = cart_repository_1.CartRespository;
const router = express_1.default.Router();
router.get("/orders", middleware_1.RequestAuthorizer, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            next(new Error("User not found"));
            return;
        }
        const response = yield service.GetOrders(user.id, repo);
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
}));
router.get("/orders/:id", middleware_1.RequestAuthorizer, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            next(new Error("User not found"));
            return;
        }
        const response = yield service.GetOrder(parseInt(req.params.id), repo);
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
}));
router.post("/orders", middleware_1.RequestAuthorizer, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            next(new Error("User not found"));
            return;
        }
        // await MessageBroker.publish({
        //   topic: "OrderEvents",
        //   headers: { correlationId: "12345", timestamp: new Date().toISOString() },
        //   event: OrderEvent.CREATE_ORDER,
        //   message: {
        //     orderId: 1,
        //     items: [
        //       {
        //         productId: 1,
        //         quantity: 1,
        //       },
        //       {
        //         productId: 2,
        //         quantity: 2,
        //       },
        //     ],
        //   },
        // });
        const response = yield service.CreateOrder(user.id, repo, cartRepo);
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
}));
router.patch("/orders/:id", middleware_1.RequestAuthorizer, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            next(new Error("User not found"));
            return;
        }
        const error = (0, utils_1.ValidateRequest)(req.body, orderRequest_dto_1.OrderUpdateSchema);
        if (error) {
            next(new utils_1.ValidationError("Invalid request inputs."));
        }
        else {
            const orderId = parseInt(req.params.id);
            const status = req.body.status;
            const response = yield service.UpdateOrder(orderId, status, repo);
            res.status(200).json(response);
        }
    }
    catch (error) {
        next(error);
    }
}));
router.delete("/orders/:id", middleware_1.RequestAuthorizer, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            next(new Error("User not found"));
            return;
        }
        const orderId = parseInt(req.params.id);
        const response = yield service.DeleteOrder(orderId, repo);
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
}));
router.get("/orders/:id/checkout", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderNumber = Number(req.params.id);
        const orderDetails = yield service.CheckoutOrder(orderNumber, repo);
        res.status(200).json(orderDetails);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
