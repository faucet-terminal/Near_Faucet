import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { connect, utils } from "near-api-js";
import GetFaucetNetworkConfig, { GetExploerUrl } from "../config/faucet.config";
import { TypedError } from "near-api-js/lib/providers";

const FaucetRoutes: Router = Router();
const FAUCET_ACCOUNT_ID = process.env.FAUCET_ACCOUNT_ID || "";

FaucetRoutes.post(
  "/request",
  (req: Request, resp: Response, next: NextFunction) => {
    const { address, network, amount } = req.body;

    if (!address || !network || !amount) {
      console.error(
        "address/network/amount is required.",
        address,
        network,
        amount
      );
      return resp.status(400).json({
        success: false,
        message: "address/network/amount is required.",
      });
    }

    const transferAmount = utils.format.parseNearAmount(amount);
    if (!transferAmount) {
      return resp
        .status(400)
        .json({ success: false, message: "amount is incorrect." });
    }

    const respBody: { [key: string]: any } = { success: true, message: "" };

    GetFaucetNetworkConfig(network)
      .then((nearConfig) => {
        if (!nearConfig) {
          console.error("Failed to GetNetworkConfig.", network);
          throw new TypedError("", "NetworkError");
        }
        return connect(nearConfig);
      })
      .then((connection) =>
        connection.connection.provider
          .query({
            request_type: "view_account",
            finality: "final",
            account_id: address,
          })
          .then((receiverAccount) => connection.account(FAUCET_ACCOUNT_ID))
      )
      .then((account) =>
        account.getAccountBalance().then((balance) => {
          const avaliableBalance = BigInt(balance.available);
          if (avaliableBalance < BigInt(transferAmount)) {
            console.warn(
              `current avaliable balance: ${utils.format.formatNearAmount(
                balance.available
              )}`
            );
            throw new TypedError("", "NotEnoughBalance");
          }

          return account.sendMoney(address, BigInt(transferAmount));
        })
      )
      .then((result) => {
        console.log(`Transfer ${transferAmount} yoctoNEAR to ${address}`);
        const tx_id = result?.transaction_outcome?.id;
        resp.status(200).json({
          ...respBody,
          explorer_url: GetExploerUrl(network, tx_id),
          tx_id: `0x${tx_id}`,
        });
      })
      .catch(next);
  }
);

export default FaucetRoutes;
