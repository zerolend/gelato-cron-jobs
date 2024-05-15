/* eslint-disable @typescript-eslint/naming-convention */
import {
  Web3Function,
  Web3FunctionContext,
} from "@gelatonetwork/web3-functions-sdk";
import { utils } from "ethers";

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs, storage } = context;
  const { updater: _updater } = userArgs;

  const duration = Number(86400 * 1000);
  const to = String(_updater);

  // User Storage
  const lastUpdatedAt = Number(
    JSON.parse((await storage.get("lastUpdatedAt")) ?? "0")
  ) as number;

  // Price Update if 6hr are elapsed or price diff >2%
  if (Date.now() - lastUpdatedAt < duration)
    return {
      canExec: false,
      message: "cannot update now. time less than min",
    };

  const iface = new utils.Interface(["function execute() public"]);
  const data = iface.encodeFunctionData("execute", []);
  const callData = [{ to, data }];

  console.log(`updating price and timestamp: ${Date.now()}`);
  await storage.set("lastUpdatedAt", JSON.stringify(Date.now()));
  return {
    canExec: true,
    callData,
  };
});
