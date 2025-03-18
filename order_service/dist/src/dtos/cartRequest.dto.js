"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRequestBodySchema = exports.EditRequestSchema = exports.CartRequestSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.CartRequestSchema = typebox_1.Type.Object({
    productId: typebox_1.Type.Integer(),
    qty: typebox_1.Type.Integer({ minimum: 1 }),
});
exports.EditRequestSchema = typebox_1.Type.Object({
    id: typebox_1.Type.Integer(),
    qty: typebox_1.Type.Integer(),
});
exports.UpdateRequestBodySchema = typebox_1.Type.Object({
    qty: typebox_1.Type.Integer(),
    lineItemId: typebox_1.Type.Integer(),
});
