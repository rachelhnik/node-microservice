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
exports.validateUser = exports.GetStockDetails = exports.getProductDetails = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../logger");
const errors_1 = require("../errors");
const CATALOG_BASE_URL = process.env.CATALOG_BASE_URL || "http://localhost:9051";
const AUTH_SERVICE_BASE_URL = process.env.AUTH_SERVICE_BASE_URL || "http://localhost:9050/auth";
const getProductDetails = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`${CATALOG_BASE_URL}/products/${id}`);
        return response.data;
    }
    catch (error) {
        logger_1.logger.error(error);
        throw new errors_1.NotFoundError("product not found");
    }
});
exports.getProductDetails = getProductDetails;
const GetStockDetails = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(`${CATALOG_BASE_URL}/products/stock`, {
            ids,
        });
        return response.data;
    }
    catch (error) {
        logger_1.logger.error(error);
        throw new errors_1.NotFoundError("error on getting stock details");
    }
});
exports.GetStockDetails = GetStockDetails;
const validateUser = (token) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("auth url", AUTH_SERVICE_BASE_URL);
    try {
        const response = yield axios_1.default.get(`${AUTH_SERVICE_BASE_URL}/validate`, {
            headers: {
                Authorization: token,
            },
        });
        if (response.status !== 200) {
            throw new errors_1.AuthorizationError("user not authorised");
        }
        return response.data;
    }
    catch (error) {
        throw new errors_1.AuthorizationError("user not authorized");
    }
});
exports.validateUser = validateUser;
