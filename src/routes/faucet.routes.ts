import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { connect, utils } from "near-api-js";
import GetFaucetNetworkConfig, { GetExploerUrl } from "../config/faucet.config";
import { MemoryCache, NearCache } from "../config/cache.config";

const FaucetRoutes: Router = Router();
const FAUCET_ACCOUNT_ID = process.env.FAUCET_ACCOUNT_ID || "";
const NEAR_TOKEN_AMOUNT = BigInt(
  utils.format.parseNearAmount(
    process.env.FAUCET_AMOUNT_PER_REQUEST || "0.5"
  ) || 0
);
const NEAR_FAUCET_REQUEST_INTERVAL = parseInt(
  process.env.FAUCET_REQUEST_INTERVAL || "86400000",
  10
);
const LimitCache: NearCache = new MemoryCache();

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

    if (LimitCache.has(address)) {
      return resp
        .status(403)
        .json({ success: false, message: "Request limited." });
    }

    const respBody: { [key: string]: any } = { success: true, message: "" };

    GetFaucetNetworkConfig(network)
      .then((nearConfig) => {
        if (!nearConfig) {
          console.error("Failed to GetNetworkConfig.", network);
          throw new Error("Failed to GetNetworkConfig.");
        }
        return connect(nearConfig);
      })
      .then((connection) =>
        Promise.all([
          connection.connection.provider.query({
            request_type: "view_account",
            finality: "final",
            account_id: address,
          }),
          connection.account(FAUCET_ACCOUNT_ID),
        ])
      )
      .then(([, account]) => account.sendMoney(address, NEAR_TOKEN_AMOUNT))
      .then((result) => {
        LimitCache.set(address, address, NEAR_FAUCET_REQUEST_INTERVAL);
        console.log(`Transfer ${NEAR_TOKEN_AMOUNT} yoctoNEAR to ${address}`);
        const tx_id = result?.transaction_outcome?.id;
        resp.status(200).json({
          ...respBody,
          explorer_url: GetExploerUrl(network, tx_id),
          tx_id,
        });
      })
      .catch(next);
  }
);

export default FaucetRoutes;
