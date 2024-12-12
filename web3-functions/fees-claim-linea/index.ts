/* eslint-disable @typescript-eslint/naming-convention */
import {
  Web3Function,
  Web3FunctionContext,
} from "@gelatonetwork/web3-functions-sdk";
import { ethers } from "ethers";
import { Contract } from "ethers";
import { getGelatoCode } from "../odos-helpers/path";

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs } = context;
  const { contractAddress, wethAddress } = userArgs as {
    contractAddress: string;
    wethAddress: string;
  };

  const iface = new ethers.Interface([
    "function balances() public view returns (uint256[] memory, address[] memory)",
    "function execute(bytes memory data) public",
  ]);

  const runner = new ethers.JsonRpcProvider("https://rpc.linea.build");
  const contract = new Contract(contractAddress, iface, runner);

  const [balances, tokenAddresses] = (await contract.balances()) as [
    bigint[],
    `0x${string}`[]
  ];

  try {
    const ret = await getGelatoCode(
      context.gelatoArgs.chainId,
      wethAddress,
      contractAddress,
      balances.map((b) => b.toString()),
      tokenAddresses
    );

    return {
      canExec: true,
      callData: [
        {
          to: contractAddress,
          data: iface.encodeFunctionData("execute", [ret.data]),
        },
      ],
    };
  } catch (error: any) {
    const message = (error.message as string) || "";
    return {
      canExec: false,
      message,
    };
  }
});
