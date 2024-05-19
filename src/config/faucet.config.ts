import { KeyPair, keyStores } from "near-api-js";

const NearFaucetConfig = {
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://testnet.mynearwallet.com/",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://testnet.nearblocks.io",
}

export default async function GetFauceltNetworkdConfig(){
    const keyStore = new keyStores.InMemoryKeyStore();
    const keyPair = KeyPair.fromString(process.env.PRIVATE_KEY);
    await keyStore.setKey("testnet", process.env.FAUCET_ACCOUNT_ID, keyPair);
    return {...NearFaucetConfig, keyStore};
}