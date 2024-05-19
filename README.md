## 环境要求

- nodejs v20.9.0+

## 项目说明

#### 打包命令

```
npm install
npm run build
```

#### 启动命令

```
node --env-file .env dist/bundle.js
```

#### 接口说明

路径: `/api/faucet/requestNear`
参数信息:
| 字段 | 字段说明 | 必填 | 备注 |
| ---- | ---- | ---- | ---- |
| tokenAmount | 数量 | Y | 单位：yoctoNEAR，[参考地址](https://docs.near.org/tools/near-api-js/utils#near--yoctonear) |
| accountId | 接受地址 id | Y | 样例：xxx.testnet

#### 测试命令

```
curl -X POST \
-H "Content-Type: application/json" \
-d '{"tokenAmount": "1000000000000000000000000", "accountId": "kento_1.testnet"}' \
http://localhost:8080/api/faucet/requestNear

```

#### 返回样例

```
{"hash":"xxxxx3JuKXAYWVt7LJJMtm7CEf6tPcdxxxxx"}
```
