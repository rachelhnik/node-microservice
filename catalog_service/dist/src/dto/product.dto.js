"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdRequest = exports.GetAllProductsRequest = exports.EditProductRequest = exports.CreateProductRequest = void 0;
const class_validator_1 = require("class-validator");
class CreateProductRequest {
}
exports.CreateProductRequest = CreateProductRequest;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], CreateProductRequest.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)()
], CreateProductRequest.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1)
], CreateProductRequest.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsNumber)()
], CreateProductRequest.prototype, "stock", void 0);
class EditProductRequest {
}
exports.EditProductRequest = EditProductRequest;
__decorate([
    (0, class_validator_1.Min)(1)
], EditProductRequest.prototype, "price", void 0);
class GetAllProductsRequest {
}
exports.GetAllProductsRequest = GetAllProductsRequest;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)()
], GetAllProductsRequest.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)()
], GetAllProductsRequest.prototype, "offset", void 0);
class IdRequest {
}
exports.IdRequest = IdRequest;
__decorate([
    (0, class_validator_1.IsString)()
], IdRequest.prototype, "id", void 0);
