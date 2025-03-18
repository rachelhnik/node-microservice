"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const drizzle_kit_1 = require("drizzle-kit");
const config_1 = require("./src/config");
exports.default = (0, drizzle_kit_1.defineConfig)({
  out: "./src/db/migrations/*",
  schema: "./src/db/schema/*",
  dialect: "postgresql",
  dbCredentials: {
    url: config_1.DB_URL,
  },
  verbose: true,
  strict: true,
});
