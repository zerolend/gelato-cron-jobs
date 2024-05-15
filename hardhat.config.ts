import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@gelatonetwork/web3-functions-sdk/hardhat-plugin";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  w3f: {
    rootDir: "./web3-functions",
    debug: false,
    networks: ["zkSyncEra", "linea"], //(multiChainProvider) injects provider for these networks
  },
  solidity: "0.8.19",
  defaultNetwork: "linea",
  networks: {
    manta: {
      url: "https://pacific-rpc.manta.network/http",
      accounts: [process.env.WALLET_PRIVATE_KEY || ""],
    },
    era: {
      url: "https://mainnet.era.zksync.io",
      accounts: [process.env.WALLET_PRIVATE_KEY || ""],
    },
    linea: {
      url: "https://rpc.linea.build",
      accounts: [process.env.WALLET_PRIVATE_KEY || ""],
      chainId: 59144,
    },
    blast: {
      url: "https://rpc.ankr.com/blast",
      accounts: [process.env.WALLET_PRIVATE_KEY || ""],
      chainId: 81457,
    },
  },
  etherscan: {
    apiKey: {
      manta: "123",
      blast: "BIMMMKKB7I2HMABKJ9C2U1EH6PIIZCSPEF",
      linea: "Y7TKICWCPM22AUWWF3TXXAFCMPT6XTVHJI",
      // [eEthereumNetwork.main]: "YKI5VW86TBDGWQZQFHIA3AACABTUUFMYPV",
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
      {
        network: "blast",
        chainId: 81457,
        urls: {
          apiURL: "https://api.blastscan.io/api",
          browserURL: "https://blastscan.io",
        },
      },
      {
        network: "linea",
        chainId: 59144,
        urls: {
          apiURL: "https://api.lineascan.build/api",
          browserURL: "https://lineascan.build",
        },
      },
    ],
  },
};

export default config;
