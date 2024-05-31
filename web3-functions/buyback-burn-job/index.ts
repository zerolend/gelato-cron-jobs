/* eslint-disable @typescript-eslint/naming-convention */
import {
  Web3Function,
  Web3FunctionContext,
} from "@gelatonetwork/web3-functions-sdk";
import { ethers } from "ethers";
import { utils, Contract } from "ethers";
import { getGelatoCode as getOdosCode } from "./path";

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs } = context;
  const { contractAddress, zeroAddress } = userArgs as {
    contractAddress: string;
    zeroAddress: string;
  };

  const iface = new utils.Interface([
    "function balances() public view returns (uint256[] memory, address[] memory)",
    "function execute(bytes memory data) public",
  ]);

  const provider = context.multiChainProvider.default();
  const contract = new Contract(contractAddress, iface, provider);

  const [balances, tokenAddresses] = (await contract.balances()) as [
    ethers.BigNumber[],
    `0x${string}`[]
  ];

  try {
    const ret = await getOdosCode(
      context.gelatoArgs.chainId,
      zeroAddress,
      contractAddress,
      balances.map((b) => b.toString()),
      tokenAddresses
    );

    const data = iface.encodeFunctionData("execute", [ret.data]);

    return {
      canExec: true,
      callData: [{ to: contractAddress, data }],
    };
  } catch (error: any) {
    const message = (error.message as string) || "";
    return {
      canExec: false,
      message,
    };
  }
});
