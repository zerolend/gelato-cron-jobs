import dotenv from "dotenv";
import { createWalletClient, http, getContract } from "viem";
import { manta } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import cron from "node-cron";

import abi from "./abi/claimer.json";

dotenv.config();

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
    chain: manta,
    transport: http(),
  });

  const contract = getContract({
    address: "0x309cfe19f7963d0fc355e6acb1f82299a8cc76eb",
    abi,
    // 1a. Insert a single client
    client: walletClient,
  });

  const tx = await contract.write.execute();
  console.log(tx);
};

main();
cron.schedule("0 0 * * *", main);
