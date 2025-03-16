import express, { ErrorRequestHandler } from "express";
import authRoutes from "./auth/authRoutes";
import router from "./auth/authRoutes";
import cors from "cors";
import { HandleErrorWithLogger, httpLogger } from "./utils";

export const ExpressApp = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(httpLogger);
  app.use(express.json());

  app.use("/auth", router);
  app.use(HandleErrorWithLogger as unknown as ErrorRequestHandler);

  return app;
};
