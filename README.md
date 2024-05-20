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

路径: `/near/request`
参数信息:
| 字段 | 字段说明 | 必填 | 备注 |
| ---- | ---- | ---- | ---- |
| network | 数量 | Y | `mainnet\|testnet` |
| address | 接受地址 id | Y | 样例：xxx.testnet |

#### 测试命令

```
curl -X POST \
-H "Content-Type: application/json" \
-d '{"network": "testnet", "address": "kento_1.testnet"}' \
http://localhost:8080/near/request

```

#### 返回样例

```
{
    "success":true,
    "message":"",
    "explorer_url":"https://testnet.nearblocks.io",
    "tx_id":"7pRR3YCsdnAaiFL5vPnJcyS9V4XBDGNxPnio2z1TLYFa"
}
```
