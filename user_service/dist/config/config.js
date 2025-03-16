"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_EXPIRES_IN = exports.JWT_SECRET = exports.APP_PORT = exports.DB_URL = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.DB_URL = process.env.DATABASE_URL || "";
exports.APP_PORT = process.env.APP_PORT || "";
exports.JWT_SECRET = process.env.JWT_SECRET || "";
exports.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
