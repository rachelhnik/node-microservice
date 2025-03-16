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
exports.startServer = void 0;
const app_1 = require("./app");
const utils_1 = require("./utils");
const logger_1 = require("./utils/logger");
const PORT = process.env.PORT || 9000;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const expressApp = yield (0, app_1.ExpressApp)();
    expressApp.listen(PORT, () => {
        logger_1.logger.info(`App is listening to ${PORT}`);
    });
    process.on("uncaughtException", (err) => __awaiter(void 0, void 0, void 0, function* () {
        (0, utils_1.HandleUncaughtException)(err);
    }));
});
exports.startServer = startServer;
(0, exports.startServer)().then(() => {
    logger_1.logger.info("server is up");
});
