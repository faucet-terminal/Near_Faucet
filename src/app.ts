import bodyParser from 'body-parser';
import express, { type Application } from 'express';
import MainRouter from './routes';
import path from 'path';
import ErrorHandlers from './handlers/error.handlers';
import GetFauceltNetworkdConfig from './config/faucet.config';

export default async function InitializeApplication() {
  const app: Application = express();

  // 路由配置
  app.use(bodyParser.json());
  app.use('/api', MainRouter);

  // 测试界面
  const publicPath = path.resolve(__dirname, '..', 'public');
  app.use(express.static(publicPath));

  // 全局异常处理
  ErrorHandlers(app);

  // 全局配置写入
  const faucetConfig = await GetFauceltNetworkdConfig();
  app.set('nearConfig', faucetConfig);

  return app;
}
