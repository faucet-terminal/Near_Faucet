import { ConnectConfig, KeyPair, keyStores } from "near-api-js";

export interface NetworkConfig extends ConnectConfig {
  explorerUrl?: string;
}

function GetNetWorkConfig(networkId: string) {
  if (networkId === "testnet") {
    return {
      privateKey: process.env.PRIVATE_KEY || "",
      accountId: process.env.FAUCET_ACCOUNT_ID || "",
      networkId: "testnet",
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://testnet.mynearwallet.com/",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://testnet.nearblocks.io",
    };
  } else if (networkId === "mainnet") {
    return {
      privateKey: process.env.MAINNET_PRIVATE_KEY || "",
      accountId: process.env.MAINNET_FAUCET_ACCOUNT_ID || "",
      networkId: "mainnet",
      nodeUrl: "https://rpc.mainnet.near.org",
      walletUrl: "https://wallet.mainnet.near.org",
      helperUrl: "https://helper.mainnet.near.org",
      explorerUrl: "https://nearblocks.io",
    };
  } else {
    return {};
  }
}

async function GetKeystore(
  privateKey: string,
  accountId: string,
  networkId: string
): Promise<keyStores.KeyStore> {
  // creates keyStore from a private key string
  // you can define your key here or use an environment variable
  const myKeyStore = new keyStores.InMemoryKeyStore();
  // creates a public / private key pair using the provided private key
  const keyPair = KeyPair.fromString(privateKey);
  // adds the keyPair you created to keyStore
  await myKeyStore.setKey(networkId, accountId, keyPair);
  return myKeyStore;
}

const NetworkConfigCache: { [key: string]: ConnectConfig } = {};

export default async function GetFaucetNetworkConfig(
  networkId: string
): Promise<NetworkConfig> {
  if (networkId in NetworkConfigCache) {
    return NetworkConfigCache[networkId];
  }

  const { privateKey, accountId, ...config } = GetNetWorkConfig(networkId);
  if (privateKey && accountId) {
    const keyStore = await GetKeystore(privateKey, accountId, networkId);
    NetworkConfigCache[networkId] = {
      ...config,
      keyStore,
    } as NetworkConfig;
  }
  return NetworkConfigCache[networkId];
}

export function GetExploerUrl(networkId: string, transactionId: string) {
  return GetNetWorkConfig(networkId)?.explorerUrl + `/txns/${transactionId}`;
}
