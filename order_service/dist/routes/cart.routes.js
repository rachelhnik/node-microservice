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
const service = __importStar(require("../service/cart.service"));
const repository = __importStar(require("../respository/cart.repository"));
const validator_1 = require("../utils/validator");
const cartRequest_dto_1 = require("../dtos/cartRequest.dto");
const errors_1 = require("../utils/errors");
const middleware_1 = require("./middleware");
const router = express_1.default.Router();
const repo = repository.CartRespository;
router.get("/cart", middleware_1.RequestAuthorizer, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            next(new Error("User not found"));
            return;
        }
        const response = yield service.GetCart(user.id, repo);
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
}));
router.post("/cart", middleware_1.RequestAuthorizer, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            next(new Error("User not found"));
            return;
        }
        const error = (0, validator_1.ValidateRequest)(req.body, cartRequest_dto_1.CartRequestSchema);
        if (error) {
            next(new errors_1.ValidationError("Invalid request inputs."));
        }
        const input = req.body;
        const response = yield service.CreateCart(Object.assign(Object.assign({}, input), { customerId: user === null || user === void 0 ? void 0 : user.id }), repo);
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
}));
router.patch("/cart/:id", middleware_1.RequestAuthorizer, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            next(new Error("User not found"));
            return;
        }
        const error = (0, validator_1.ValidateRequest)(req.body, cartRequest_dto_1.UpdateRequestBodySchema);
        if (error) {
            next(new errors_1.ValidationError("Invalid request inputs."));
        }
        else {
            const response = yield service.UpdateCartItem({
                id: req.body.lineItemId,
                qty: req.body.qty,
                customerId: user.id,
            }, repo);
            console.log("RESPONSE", response);
            res.status(200).json(response);
        }
    }
    catch (error) {
        next(error);
    }
}));
router.delete("/cart/:id", middleware_1.RequestAuthorizer, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            next(new Error("User not found"));
            return;
        }
        const liteItemId = req.params.id;
        const response = yield service.DeleteCartItem({ customerId: user.id, id: +liteItemId }, repo);
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
