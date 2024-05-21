import bodyParser from "body-parser";
import express, { type Application } from "express";
import MainRouter from "./routes";
import { GlobalErrorHandler } from "./handlers/error.handlers";

export default function InitializeApplication() {
  const app: Application = express();

  // 路由配置
  app.use(bodyParser.json());
  app.use("/near", MainRouter);

  // 全局异常处理
  app.use(GlobalErrorHandler);
  app.use((req, resp, next) => {
    resp.status(404).json({
      success: false,
      message: "404 not found",
    });
  });

  return app;
}
