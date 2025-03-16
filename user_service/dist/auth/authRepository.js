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
exports.AuthRepository = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const utils_1 = require("../utils");
const config_1 = require("../config/config");
const gereateToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign(user, config_1.JWT_SECRET, { expiresIn: Number(config_1.JWT_EXPIRES_IN) }, (err, token) => {
            if (err)
                reject(err);
            else
                resolve(token);
        });
    });
});
const RegisterUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const alreadyExist = yield db_1.prisma.users.findFirst({
        where: {
            email: data.email,
        },
    });
    if (alreadyExist) {
        throw new utils_1.ValidationError("User already exists.");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(data.password, 10);
    const newUser = yield db_1.prisma.users.create({
        data: Object.assign(Object.assign({}, data), { password: hashedPassword }),
    });
    return newUser;
});
const LoginUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.prisma.users.findFirst({
        where: {
            email: data.email,
        },
    });
    if (!user) {
        throw new utils_1.NotFoundError("User not found.");
    }
    const validPassword = yield bcryptjs_1.default.compare(data.password, user.password);
    if (!validPassword) {
        throw new utils_1.ValidationError("Incorrect password.");
    }
    const token = gereateToken({
        id: user.id,
        email: user.email,
    });
    return token;
});
const ValidateUser = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenData = token.split(" ")[1];
    const user = jsonwebtoken_1.default.verify(tokenData, config_1.JWT_SECRET);
    if (user) {
        return user;
    }
    else {
        throw new utils_1.AuthorizationError("Jwt invalid.");
    }
});
exports.AuthRepository = {
    RegisterUser,
    LoginUser,
    ValidateUser,
};
