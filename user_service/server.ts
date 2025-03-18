import { ExpressApp } from "./app";
import { prisma } from "./config/db";
import { HandleUncaughtException } from "./utils";
import { logger } from "./utils/logger";
const PORT = process.env.PORT || 9050;

export const startServer = async () => {
  async function connectWithRetry(retries = 5, delay = 2000) {
    for (let i = 0; i < retries; i++) {
      try {
        await prisma.$connect();
        console.log("Database connected successfully");
        return;
      } catch (error: any) {
        console.error(`Attempt ${i + 1} failed: ${error?.message}`);
        if (i === retries - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  await connectWithRetry();

  const expressApp = await ExpressApp();
  expressApp.listen(PORT, () => {
    logger.info(`App is listening to ${PORT}`);
  });
  process.on("uncaughtException", async (err) => {
    HandleUncaughtException(err);
  });
};

startServer().then(() => {
  logger.info("server is up");
});
