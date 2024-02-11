import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  w3f: {
    rootDir: "./web3-functions",
    debug: false,
    networks: ["zkSyncEra"], //(multiChainProvider) injects provider for these networks
  },
  solidity: "0.8.19",
  defaultNetwork: "manta",
  networks: {
    manta: {
      url: "https://pacific-rpc.manta.network/http",
      accounts: [process.env.WALLET_PRIVATE_KEY || ""],
    },
  },
  etherscan: {
    apiKey: {
      manta: "123",
    },
    customChains: [
      {
        network: "manta",
        chainId: 169,
        urls: {
          apiURL: "https://pacific-explorer.manta.network/api",
          browserURL: "https://pacific-explorer.manta.network",
        },
      },
    ],
  },
};

export default config;
