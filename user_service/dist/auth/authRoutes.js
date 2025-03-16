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
const express_1 = __importDefault(require("express"));
const request_validator_1 = require("../utils/request-validator");
const AuthRequest_dto_1 = require("./dtos/AuthRequest.dto");
const utils_1 = require("../utils");
const authService_1 = require("./authService");
require("dotenv").config();
const router = express_1.default.Router();
router.post("/register", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { errors, input } = yield (0, request_validator_1.RequestValidator)(AuthRequest_dto_1.CreateUserRequest, req.body);
        if (errors) {
            next(new utils_1.ValidationError("Invalid request."));
        }
        const user = yield (0, authService_1.registerUser)(req.body);
        if (user) {
            res.status(200).send(user);
        }
        else {
            next(new utils_1.APIError("Something went wrong."));
        }
    }
    catch (error) {
        next(error);
    }
}));
router.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { errors, input } = yield (0, request_validator_1.RequestValidator)(AuthRequest_dto_1.LoginUserRequest, req.body);
        if (errors) {
            next(new utils_1.ValidationError("Invalid request."));
        }
        const token = yield (0, authService_1.loginUser)(req.body);
        if (token) {
            return res.status(200).json({ message: "Login successful", token });
        }
        else {
            next(new utils_1.APIError("Something went wrong."));
        }
    }
    catch (error) {
        next(error);
    }
}));
router.get("/validate", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers["authorization"];
        if (!token) {
            return next(new utils_1.AuthorizationError("Unauthorized."));
        }
        try {
            const user = yield (0, authService_1.validateUser)(token);
            return res.status(200).json(user);
        }
        catch (error) {
            return res.status(403).json({ message: "Invalid token00000" });
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
