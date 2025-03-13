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
const _1 = require("@faker-js/faker/.");
const mockCatalog_respository_1 = require("../../repository/mockCatalog.respository");
const catalog_service_1 = require("../catalog.service");
const fixtures_1 = require("../../utils/fixtures");
const mockProduct = (rest) => {
    return Object.assign({ name: _1.faker.commerce.productName(), description: _1.faker.commerce.productDescription(), stock: _1.faker.number.int({ min: 10, max: 100 }) }, rest);
};
describe("catalogService", () => {
    let repository;
    beforeEach(() => {
        repository = new mockCatalog_respository_1.MockCatalogRepository();
    });
    afterEach(() => {
        repository = {};
    });
    describe("create product", () => {
        test("should create product", () => __awaiter(void 0, void 0, void 0, function* () {
            const service = new catalog_service_1.CatalogService(repository);
            const reqBody = mockProduct({
                price: +_1.faker.commerce.price(),
            });
            const result = yield service.createProduct(reqBody);
            expect(result).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                description: expect.any(String),
                price: expect.any(Number),
                stock: expect.any(Number),
            });
        }));
        test("should throw error with unable to create product", () => __awaiter(void 0, void 0, void 0, function* () {
            const service = new catalog_service_1.CatalogService(repository);
            const reqBody = mockProduct({
                price: +_1.faker.commerce.price(),
            });
            jest
                .spyOn(repository, "create")
                .mockImplementationOnce(() => Promise.resolve({}));
            yield expect(service.createProduct(reqBody)).rejects.toThrow("Unable to create product.");
        }));
        test("should throw error with product already exists", () => __awaiter(void 0, void 0, void 0, function* () {
            const service = new catalog_service_1.CatalogService(repository);
            const reqBody = mockProduct({
                price: +_1.faker.commerce.price(),
            });
            jest
                .spyOn(repository, "create")
                .mockImplementationOnce(() => Promise.reject(new Error("Product already exists.")));
            yield expect(service.createProduct(reqBody)).rejects.toThrow("Product already exists.");
        }));
    });
    describe("update product", () => {
        test("should update product", () => __awaiter(void 0, void 0, void 0, function* () {
            const service = new catalog_service_1.CatalogService(repository);
            const reqBody = mockProduct({
                price: +_1.faker.commerce.price(),
                id: _1.faker.number.int({ min: 10, max: 1000 }),
            });
            const result = yield service.updateProduct(reqBody);
            expect(result).toMatchObject(reqBody);
        }));
        test("should throw error with product does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
            const service = new catalog_service_1.CatalogService(repository);
            jest
                .spyOn(repository, "update")
                .mockImplementationOnce(() => Promise.reject(new Error("Product does not exist.")));
            yield expect(service.updateProduct({})).rejects.toThrow("Product does not exist.");
        }));
    });
    describe("find products", () => {
        test("should find all products", () => __awaiter(void 0, void 0, void 0, function* () {
            const service = new catalog_service_1.CatalogService(repository);
            const randomLimit = _1.faker.number.int({ min: 10, max: 50 });
            const products = fixtures_1.ProductFactory.buildList(randomLimit);
            jest
                .spyOn(repository, "find")
                .mockImplementationOnce(() => Promise.resolve(products));
            const result = yield service.getAllProducts(randomLimit, 0);
            expect(result.length).toEqual(randomLimit);
            expect(result).toMatchObject(products);
        }));
        test("should throw error with product does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
            const service = new catalog_service_1.CatalogService(repository);
            jest
                .spyOn(repository, "find")
                .mockImplementationOnce(() => Promise.reject(new Error("products does not exist")));
            yield expect(service.getAllProducts(0, 0)).rejects.toThrow("products does not exist");
        }));
    });
    describe("find product", () => {
        test("should find a product by id", () => __awaiter(void 0, void 0, void 0, function* () {
            const service = new catalog_service_1.CatalogService(repository);
            const product = fixtures_1.ProductFactory.build();
            jest
                .spyOn(repository, "findOne")
                .mockImplementationOnce(() => Promise.resolve(product));
            const result = yield service.getSingleProduct(product.id);
            expect(result).toMatchObject(product);
        }));
    });
    describe("delete product", () => {
        test("should delete a product by id ", () => __awaiter(void 0, void 0, void 0, function* () {
            const service = new catalog_service_1.CatalogService(repository);
            const product = fixtures_1.ProductFactory.build();
            jest
                .spyOn(repository, "delete")
                .mockImplementationOnce(() => Promise.resolve({ id: product.id }));
            const result = yield service.deleteProduct(product.id);
            expect(result).toMatchObject({ id: product.id });
        }));
    });
});
