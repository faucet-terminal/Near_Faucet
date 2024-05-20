import { Router, type Request, type Response } from "express";
import FaucetRoutes from "./faucet.routes";

const MainRouter: Router = Router();

MainRouter.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});
MainRouter.use("/", FaucetRoutes);

export default MainRouter;
