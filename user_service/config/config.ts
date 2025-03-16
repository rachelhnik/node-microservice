import dotenv from "dotenv";
dotenv.config();

export const DB_URL = process.env.DATABASE_URL || "";
export const APP_PORT = process.env.APP_PORT || "";
export const JWT_SECRET = process.env.JWT_SECRET || "";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
