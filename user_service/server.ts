import { ExpressApp } from "./app";
import { HandleUncaughtException } from "./utils";
import { logger } from "./utils/logger";
const PORT = process.env.PORT || 9000;

export const startServer = async () => {
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
