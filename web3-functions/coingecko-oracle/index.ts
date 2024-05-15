/* eslint-disable @typescript-eslint/naming-convention */
import {
  Web3Function,
  Web3FunctionContext,
} from "@gelatonetwork/web3-functions-sdk";
import { utils } from "ethers";
import ky from "ky"; // we recommend using ky as axios doesn't support fetch by default

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs } = context;
  const { coingeckoSlug, oracle } = userArgs as {
    coingeckoSlug: string;
    oracle: string;
  };

  const key = await context.secrets.get("COINGECKO_API");
  const coingeckoApi = `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoSlug}&vs_currencies=usd&x_cg_demo_api_key=${key}`;

  let price = 0;
  try {
    const priceData: { [key: string]: { usd: number } } = await ky
      .get(coingeckoApi, { timeout: 5_000, retry: 0 })
      .json();

    price = Math.floor(priceData[coingeckoSlug].usd * 1e8);
  } catch (err) {
    console.log(err);
    return { canExec: false, message: `Coingecko call failed` };
  }

  if (price > 0) {
    const iface = new utils.Interface([
      "function setAnswer(int256 val) public",
    ]);
    const data = iface.encodeFunctionData("setAnswer", [price]);
    const callData = [{ to: oracle as string, data }];

    return {
      canExec: true,
      callData,
    };
  }

  return {
    canExec: false,
    message: "invalid price from coingecko",
  };
});
