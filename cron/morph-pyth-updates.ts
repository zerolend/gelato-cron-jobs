import dotenv from "dotenv";
import { createWalletClient, http, getContract } from "viem";
import { morph } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import cron from "node-cron";
import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";

import abi from "./abi/pyth.json";

dotenv.config();

export const priceIdsUSD = {
  weth: "0x9d4294bbcd1174d6f2003ec365831e64cc31d9f6f15a2b85399db8d5000960f6",
  usdc: "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
  usdt: "0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b",
  wbtc: "0xc9d8b075a5c69303365ae23633d4e085199bf5c520a3b90fed1322a0342ffc33",
  usda: "0x3a1050a3c03354c94ed44acf808327f05b7f9d610f38644684f5ce4796cce27b",
  bgb: "0x708bfcf418ead52a408407b039f2c33ce24ddc80d6dcb6d1cffef91c156c80fa",
  usde: "0x6ec879b1e9963de5ee97e9c8710b742d6228252a5e2ca12d4ae81d7fe5ee8c5d",
};

export const pythContracts = {
  manta: "0xA2aa501b19aff244D90cc15a4Cf739D2725B5729",
  zksync: "0xf087c864AEccFb6A2Bf1Af6A0382B0d0f6c5D834",
  blastSepolia: "0xA2aa501b19aff244D90cc15a4Cf739D2725B5729",
  blast: "0xA2aa501b19aff244D90cc15a4Cf739D2725B5729",
};

// An example of a deploy script that will deploy and call a simple contract.
const main = async function () {
  console.log(`Running script for FeesClaimer`);

  const account = privateKeyToAccount(
    process.env.WALLET_PRIVATE_KEY as `0x${string}`
  );

  console.log("i am", account.address);

  // 2. Set up your client with desired chain & transport.
  const walletClient = createWalletClient({
    account,
    chain: morph,
    transport: http(),
  });

  const contract = getContract({
    address: "0x0Bd27617E20F09a8E7FFdaE281E383b4b2f7A742",
    abi,
    // 1a. Insert a single client
    client: walletClient,
  });

  const updateData = [
    priceIdsUSD.weth,
    priceIdsUSD.usdc,
    priceIdsUSD.usdt,
    priceIdsUSD.wbtc,
    priceIdsUSD.usda,
    priceIdsUSD.bgb,
    priceIdsUSD.usde,
  ];

  const connection = new EvmPriceServiceConnection(
    "https://hermes.pyth.network"
  ); // See Hermes endpoints section below for other endpoints

  const priceUpdateData = (await connection.getPriceFeedsUpdateData(
    updateData
  )) as any;

  const tx = await contract.write.updateFeeds([priceUpdateData], {
    value: 10000n,
  });
  console.log(tx);
};

main();
cron.schedule("0 * * * *", main);
