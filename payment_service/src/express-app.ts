import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import cors from "cors";
import { httpLogger } from "./utils/logger";
import { HandleErrorWithLogger } from "./utils/errors";
import { InitializeBroker } from "./service/broker.service";
import dotenv from "dotenv";
import router from "./routes/payment.routes";

export const ExpressApp = async () => {
  const app = express();

  app.use(cors({ origin: "*" }));
  app.use(express.json());
  app.use(httpLogger);
  dotenv.config();
  await InitializeBroker();
  app.use(router);
  app.use("/", (req: Request, res: Response, _: NextFunction) => {
    res.status(200).json({ message: "I am healthy." });
  });

  app.use(HandleErrorWithLogger as unknown as ErrorRequestHandler);

  return app;
};
