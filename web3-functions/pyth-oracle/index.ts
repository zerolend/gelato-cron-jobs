/* eslint-disable @typescript-eslint/naming-convention */
import {
  Web3Function,
  Web3FunctionContext,
} from "@gelatonetwork/web3-functions-sdk";
import { utils } from "ethers";

import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs } = context;

  const {
    priceIds: _priceIds,
    duration: _duration,
    updater: _updater,
  } = userArgs;
  const priceIds = _priceIds as string[];
  const updater = String(_updater);

  // Get Pyth price data
  const connection = new EvmPriceServiceConnection(
    "https://hermes.pyth.network"
  );

  const check = (await connection.getLatestPriceFeeds(priceIds)) as any[];
  if (
    check.length == 0 ||
    check[0].price == undefined ||
    check[0].price.price == undefined
  ) {
    return { canExec: false, message: "No price available" };
  }

  const iface = new utils.Interface([
    "function updateFeeds(bytes[] calldata priceUpdateData) public payable",
  ]);

  const updatePriceData = await connection.getPriceFeedsUpdateData(priceIds);

  console.log(updatePriceData[0]);
  const data = iface.encodeFunctionData("updateFeeds", [updatePriceData]);

  const callData = [
    {
      to: updater,
      data,
    },
  ];

  return {
    canExec: true,
    callData,
  };
});
