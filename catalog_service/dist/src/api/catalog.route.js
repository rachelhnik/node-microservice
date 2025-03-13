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
exports.catalogService = void 0;
const express_1 = __importDefault(require("express"));
const catalog_service_1 = require("../services/catalog.service");
const catalog_respository_1 = require("../repository/catalog.respository");
const requestValidator_1 = require("../utils/requestValidator");
const product_dto_1 = require("../dto/product.dto");
const broker_service_1 = require("../services/broker.service");
const router = express_1.default.Router();
exports.catalogService = new catalog_service_1.CatalogService(new catalog_respository_1.CatalogRepository());
const brokerService = new broker_service_1.BrokerService(exports.catalogService);
brokerService.initializeBroker();
router.post("/products", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { errors, input } = yield (0, requestValidator_1.RequestValidator)(product_dto_1.CreateProductRequest, req.body);
        if (errors) {
            res.status(400).json(errors);
        }
        const data = yield exports.catalogService.createProduct(input);
        return res.status(201).json(data);
    }
    catch (error) {
        next(error);
    }
}));
router.patch("/products/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { errors, input } = yield (0, requestValidator_1.RequestValidator)(product_dto_1.EditProductRequest, req.body);
        if (errors) {
            return res.status(400).json(errors);
        }
        const id = parseInt(req.params.id) || 0;
        const data = yield exports.catalogService.updateProduct(Object.assign(Object.assign({}, input), { id }));
        return res.status(200).json(data);
    }
    catch (error) {
        next(error);
    }
}));
router.get("/products", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = Number(req.query["limit"]);
    const offset = Number(req.query["offset"]);
    console.log("HIII");
    try {
        const { errors, input } = yield (0, requestValidator_1.RequestValidator)(product_dto_1.GetAllProductsRequest, req.params);
        if (errors) {
            return res.status(400).json(errors);
        }
        const data = yield exports.catalogService.getAllProducts(limit, offset);
        return res.status(200).json(data);
    }
    catch (error) {
        next(error);
    }
}));
router.get("/products/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id) || 0;
    try {
        const { errors, input } = yield (0, requestValidator_1.RequestValidator)(product_dto_1.IdRequest, req.params);
        if (errors) {
            return res.status(400).json(errors);
        }
        const data = yield exports.catalogService.getSingleProduct(id);
        return res.status(200).json(data);
    }
    catch (error) {
        return next(error);
    }
}));
router.post("/products/stock", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("HELLO");
        const data = yield exports.catalogService.getProductStock(req.body.ids);
        return res.status(200).json(data);
    }
    catch (error) {
        return next(error);
    }
}));
router.delete("/products/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { errors, input } = yield (0, requestValidator_1.RequestValidator)(product_dto_1.IdRequest, req.params);
        if (errors) {
            return res.status(400).json(errors);
        }
        const id = parseInt(req.params.id) || 0;
        const data = yield exports.catalogService.deleteProduct(id);
        return res.status(200).json(data);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
