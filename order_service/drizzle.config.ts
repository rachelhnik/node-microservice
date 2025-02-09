import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { DB_URL } from "./src/config";

export default defineConfig({
  out: "./src/db/migrations/*",
  schema: "./src/db/schema/*",
  dialect: "postgresql",
  dbCredentials: {
    url: DB_URL!,
  },
  verbose: true,
  strict: true,
});
