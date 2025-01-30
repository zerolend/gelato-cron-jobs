import dotenv from "dotenv";
import { createWalletClient, http, getContract } from "viem";
import { abstract } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import cron from "node-cron";
import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";

import abi from "./abi/pyth.json";

dotenv.config();

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
    chain: abstract,
    transport: http(),
  });

  const contract = getContract({
    address: "0x5512E04EeadB8931fffDd48bBD7a066A01E96590",
    abi,
    // 1a. Insert a single client
    client: walletClient,
  });

  const updateData = [
    "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
    "0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b",
    "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
    "0xbed3097008b9b5e3c93bec20be79cb43986b85a996475589351a21e67bae9b61",
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
