import ExpressApp from "./expressApp";
import { logger } from "./utils";
const PORT = process.env.PORT || 8000;

export const startServer = async () => {
  ExpressApp.listen(PORT, () => {
    console.log(`Server is listening at port: ${PORT}`);
  });
  process.on("uncaughtException", async (err) => {
    console.log(err);
    process.exit(1);
  });
};

startServer().then(() => {
  logger.info("server is up");
});
