import { ExpressApp } from "./express-app";
import { logger } from "./utils/logger";
const PORT = process.env.PORT || 9000;

export const startServer = async () => {
  const expressApp = await ExpressApp();
  expressApp.listen(PORT, () => {
    logger.info(`App is listening to ${PORT}`);
  });
  process.on("uncaughtException", async (err) => {
    logger.error(err);
    process.exit(1);
  });
};

startServer().then(() => {
  logger.info("server is up");
});
