import express, { ErrorRequestHandler } from "express";
import router from "./api/catalog.route";
import { HandleErrorWithLogger, httpLogger } from "./utils";

const app = express();

app.use(httpLogger);
app.use(express.json());

app.use("/", router);
app.use(HandleErrorWithLogger as unknown as ErrorRequestHandler);
export default app;
