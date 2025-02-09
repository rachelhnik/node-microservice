import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import cors from "cors";
import OrderRoutes from "./routes/order.routes";
import CartRoutes from "./routes/cart.routes";
import { httpLogger } from "./utils/logger";
import { HandleErrorWithLogger } from "./utils/errors";
import { MessageBroker } from "./utils/broker";
import { Consumer, Producer } from "kafkajs";
import { InitializeBroker } from "./service/broker.service";

export const ExpressApp = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(httpLogger);

  await InitializeBroker();

  app.use(OrderRoutes);
  app.use(CartRoutes);
  app.use("/", (req: Request, res: Response, _: NextFunction) => {
    res.status(200).json({ message: "I am healthy." });
  });
  app.use(HandleErrorWithLogger as unknown as ErrorRequestHandler);

  return app;
};
