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
exports.CatalogRepository = void 0;
const client_1 = require("@prisma/client");
class CatalogRepository {
    constructor() {
        this._prisma = new client_1.PrismaClient();
    }
    create(data) {
        return this._prisma.product.create({ data });
    }
    update(data) {
        return this._prisma.product.update({
            where: { id: data.id },
            data,
        });
    }
    delete(id) {
        return this._prisma.product.delete({
            where: { id },
        });
    }
    find(limit, offset) {
        return this._prisma.product.findMany({
            take: limit,
            skip: offset,
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this._prisma.product.findFirst({
                where: { id },
            });
            return Promise.resolve(product);
        });
    }
    findStock(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._prisma.product.findMany({
                where: {
                    id: {
                        in: ids,
                    },
                },
            });
        });
    }
}
exports.CatalogRepository = CatalogRepository;
