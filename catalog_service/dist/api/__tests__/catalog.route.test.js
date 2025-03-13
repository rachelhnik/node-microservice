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
const catalog_route_1 = __importStar(require("../catalog.route"));
const _1 = require("@faker-js/faker/.");
const supertest_1 = __importDefault(require("supertest"));
const fixtures_1 = require("../../utils/fixtures");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(catalog_route_1.default);
const mockProduct = () => {
    return {
        name: _1.faker.commerce.productName(),
        description: _1.faker.commerce.productDescription(),
        stock: _1.faker.number.int({ min: 1, max: 100 }),
        price: _1.faker.number.int({ min: 10, max: 10000 }),
    };
};
describe("Catalog Routes", () => {
    describe("POST /products", () => {
        test("should create a product successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const reqBody = mockProduct();
            const product = fixtures_1.ProductFactory.build();
            jest
                .spyOn(catalog_route_1.catalogService, "createProduct")
                .mockImplementationOnce(() => Promise.resolve(product));
            const response = yield (0, supertest_1.default)(app)
                .post("/products")
                .send(reqBody)
                .set("Accept", "application/json");
            expect(response.status).toEqual(201);
            expect(response.body).toMatchObject(product);
        }));
        test("should throw error on bad request", () => __awaiter(void 0, void 0, void 0, function* () {
            const reqBody = mockProduct();
            const response = yield (0, supertest_1.default)(app)
                .post("/products")
                .send(Object.assign(Object.assign({}, reqBody), { name: "" }))
                .set("Accept", "application/json");
            expect(response.status).toEqual(400);
            expect(response.body).toEqual("name should not be empty");
        }));
        test("should throw error on internal server error", () => __awaiter(void 0, void 0, void 0, function* () {
            const reqBody = mockProduct();
            jest
                .spyOn(catalog_route_1.catalogService, "createProduct")
                .mockImplementationOnce(() => Promise.reject(new Error("Internal server error.")));
            const response = yield (0, supertest_1.default)(app)
                .post("/products")
                .send(reqBody)
                .set("Accept", "application/json");
            expect(response.status).toEqual(500);
            expect(response.body).toEqual("Internal server error.");
        }));
    });
    describe("PATCH /products/:id", () => {
        test("should update a product", () => __awaiter(void 0, void 0, void 0, function* () {
            const product = fixtures_1.ProductFactory.build();
            const req = {
                name: product.name,
                stock: product.stock,
                price: product.price,
            };
            jest
                .spyOn(catalog_route_1.catalogService, "updateProduct")
                .mockImplementationOnce(() => Promise.resolve(product));
            const response = yield (0, supertest_1.default)(app)
                .patch(`/products/${product.id}`)
                .send(req)
                .set("Accept", "application/json");
            expect(response.status).toEqual(200);
            expect(response.body).toMatchObject(product);
        }));
        test("should return validation error with 400", () => __awaiter(void 0, void 0, void 0, function* () {
            const product = fixtures_1.ProductFactory.build();
            const req = {
                name: product.name,
                stock: product.stock,
                price: -2,
            };
            const response = yield (0, supertest_1.default)(app)
                .patch(`/products/${product.id}`)
                .send(req)
                .set("Accept", "application/json");
            expect(response.status).toEqual(400);
        }));
        test("should return internal server error with 500", () => __awaiter(void 0, void 0, void 0, function* () {
            const product = fixtures_1.ProductFactory.build();
            const req = {
                name: product.name,
                stock: product.stock,
                price: product.price,
            };
            jest
                .spyOn(catalog_route_1.catalogService, "updateProduct")
                .mockImplementationOnce(() => Promise.reject(new Error("Internal server error.")));
            const response = yield (0, supertest_1.default)(app)
                .patch(`/products/${product.id}`)
                .send(req)
                .set("Accept", "application/json");
            expect(response.status).toEqual(500);
        }));
    });
    describe("GET /products?limit=0&offset=0", () => {
        test("should return a range of products based on limit and offset", () => __awaiter(void 0, void 0, void 0, function* () {
            const randomLimit = _1.faker.number.int({ min: 10, max: 50 });
            const products = fixtures_1.ProductFactory.buildList(randomLimit);
            jest
                .spyOn(catalog_route_1.catalogService, "getAllProducts")
                .mockImplementationOnce(() => Promise.resolve(products));
            const response = yield (0, supertest_1.default)(app)
                .get(`/products?limit=${randomLimit}&offset=0`)
                .set("Accept", "application/json");
            expect(response.status).toBe(200);
            expect(response.body).toEqual(products);
        }));
    });
    describe("GET /products/:id", () => {
        test("should return a product by id", () => __awaiter(void 0, void 0, void 0, function* () {
            const product = fixtures_1.ProductFactory.build();
            jest
                .spyOn(catalog_route_1.catalogService, "getSingleProduct")
                .mockImplementationOnce(() => Promise.resolve(product));
            const response = yield (0, supertest_1.default)(app)
                .get(`/products/${product.id}`)
                .set("Accept", "application/json");
            expect(response.status).toBe(200);
            expect(response.body).toEqual(product);
        }));
    });
    describe("DELETE /products/:id", () => {
        test("should delete product successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const product = fixtures_1.ProductFactory.build();
            jest
                .spyOn(catalog_route_1.catalogService, "deleteProduct")
                .mockImplementationOnce(() => Promise.resolve({ id: product.id }));
            const response = yield (0, supertest_1.default)(app)
                .delete(`/products/${product.id}`)
                .set("Accept", "application/json");
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ id: product.id });
        }));
    });
});
