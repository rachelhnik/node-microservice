"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const catalog_route_1 = __importDefault(require("./api/catalog.route"));
const utils_1 = require("./utils");
const app = (0, express_1.default)();
app.use(utils_1.httpLogger);
app.use(express_1.default.json());
app.use("/", catalog_route_1.default);
app.use(utils_1.HandleErrorWithLogger);
exports.default = app;
