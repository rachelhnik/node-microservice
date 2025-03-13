import ExpressApp from "./expressApp";
import {
  HandleErrorWithLogger,
  HandleUncaughtException,
  logger,
} from "./utils";
const PORT = process.env.PORT || 8000;

export const startServer = async () => {
  ExpressApp.listen(PORT, () => {
    console.log(`Server is listening at port: ${PORT}`);
  });
  process.on("uncaughtException", async (err) => {
    HandleUncaughtException(err);
  });
};

startServer().then(() => {
  logger.info("server is up");
});
