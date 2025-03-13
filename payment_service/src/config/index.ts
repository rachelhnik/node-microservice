import dotenv from "dotenv";
dotenv.config();

export const APP_PORT = process.env.PORT;
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;
