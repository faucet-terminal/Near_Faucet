import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import { connect } from 'near-api-js';

const FaucetRoutes: Router = Router();
const FAUCET_ACCOUNT_ID = process.env.FAUCET_ACCOUNT_ID || '';

FaucetRoutes.post(
  '/requestNear',
  async function (req: Request, resp: Response, next: NextFunction) {
    const nearConfig = req.app.get('nearConfig');
    const { tokenAmount, accountId } = req.body;
    const nearConnection = await connect(nearConfig);
    const account = await nearConnection.account(FAUCET_ACCOUNT_ID);
    try {
      const result = await account.sendMoney(accountId, tokenAmount);
      console.log(`Transfer ${tokenAmount} NEAR to ${accountId}`);
      resp.status(200).json({ hash: result.transaction_outcome.id });
    } catch (error) {
      console.error('Error on sendMoney', error);
      resp.send('Failed.');
    }
  },
);

export default FaucetRoutes;
