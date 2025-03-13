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
exports.CatalogService = void 0;
class CatalogService {
    constructor(repository) {
        this._repository = repository;
    }
    createProduct(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._repository.create(input);
            if (!data.id) {
                throw new Error("Unable to create product.");
            }
            return data;
        });
    }
    updateProduct(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._repository.update(input);
            if (!data.id) {
                throw new Error("Product does not exist.");
            }
            return data;
        });
    }
    deleteProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._repository.delete(id);
            return data;
        });
    }
    getAllProducts(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._repository.find(limit, offset);
            return data;
        });
    }
    getSingleProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._repository.findOne(id);
            return data;
        });
    }
    getProductStock(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._repository.findStock(ids);
            if (!data) {
                throw new Error("unable to find product stock details.");
            }
            return data;
        });
    }
    handleBrokerMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Catalog service receives event", message);
            const orderdata = message.data;
            const { orderItems } = orderdata;
            orderItems.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                console.log("Updating stock for item", item.productId, item.qty);
                const product = yield this.getSingleProduct(item.productId);
                if (!product) {
                    throw new Error("product not found.");
                }
                const updatedStock = product.stock - item.qty;
                yield this.updateProduct(Object.assign(Object.assign({}, product), { stock: updatedStock }));
            }));
        });
    }
}
exports.CatalogService = CatalogService;
