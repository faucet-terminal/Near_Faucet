import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { connect, utils } from "near-api-js";
import GetFaucetNetworkConfig from "../config/faucet.config";

const FaucetRoutes: Router = Router();
const FAUCET_ACCOUNT_ID = process.env.FAUCET_ACCOUNT_ID || "";
const NEAR_TOKEN_AMOUNT = BigInt(
  utils.format.parseNearAmount(
    process.env.FAUCET_AMOUNT_PER_REQUEST || "0.5"
  ) || 0
);

FaucetRoutes.post(
  "/request",
  (req: Request, resp: Response, next: NextFunction) => {
    const { address, network } = req.body;

    if (!address || !network) {
      console.error("address or network is required.", address, network);
      return resp
        .status(400)
        .json({ success: false, message: "address or network is required." });
    }

    const respBody: { [key: string]: any } = { success: true, message: "" };

    GetFaucetNetworkConfig(network)
      .then((nearConfig) => {
        if (!nearConfig) {
          console.error("Failed to GetNetworkConfig.", network);
          throw new Error("Failed to GetNetworkConfig.");
        }
        respBody["explorer_url"] = nearConfig.explorerUrl;
        return connect(nearConfig);
      })
      .then((connection) => connection.account(FAUCET_ACCOUNT_ID))
      .then((account) => account.sendMoney(address, NEAR_TOKEN_AMOUNT))
      .then((result) => {
        console.log(`Transfer ${NEAR_TOKEN_AMOUNT} yoctoNEAR to ${address}`);
        resp.status(200).json({
          ...respBody,
          tx_id: result?.transaction_outcome?.id,
        });
      })
      .catch(next);
  }
);

export default FaucetRoutes;
