import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@gelatonetwork/web3-functions-sdk/hardhat-plugin";
import "hardhat-dependency-compiler";
import "hardhat-deploy";

import dotenv from "dotenv";
dotenv.config();

const defaultAccount = {
  mnemonic:
    process.env.MNEMONIC ||
    "test test test test test test test test test test test junk",
  path: "m/44'/60'/0'/0",
  initialIndex: Number(process.env.MNEMONIC_INDEX || 0),
  count: 20,
  passphrase: "",
};

const _network = (url: string, gasPrice: number | "auto" = "auto") => ({
  url,
  accounts: defaultAccount,
  saveDeployments: true,
  gasPrice,
});

const config: HardhatUserConfig = {
  w3f: {
    rootDir: "./web3-functions",
    debug: false,
    networks: ["linea", "base", "mainnet", "berachain"], // (multiChainProvider) injects provider for these networks
  },
  solidity: "0.8.20",
  dependencyCompiler: {
    paths: [
      "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol",
    ],
  },
  networks: {
    hardhat: {
      // forking: {
      //   url: `https://rpc.ankr.com/eth`,
      // },
      accounts: defaultAccount,
    },
    arbitrum: _network("https://arb1.arbitrum.io/rpc"),
    base: _network("https://mainnet.base.org"),
    bsc: _network("https://bsc-dataseed1.bnbchain.org"),
    blast: _network("https://rpc.blast.io"),
    linea: _network("https://rpc.linea.build"),
    mainnet: _network("https://rpc.ankr.com/eth"),
    zircuit: _network("https://zircuit-mainnet.drpc.org"),
    optimism: _network("https://mainnet.optimism.io"),
    scroll: _network("https://rpc.ankr.com/scroll", 1100000000),
    sepolia: _network("https://rpc2.sepolia.org"),
    xlayer: _network("https://xlayerrpc.okx.com"),
    berachain: _network("https://rpc.berachain.com"),
  },
  namedAccounts: {
    deployer: 0,
    proxyAdmin: 1,
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_KEY || "",
      sepolia: process.env.ETHERSCAN_KEY || "",
      base: process.env.BASESCAN_KEY || "",
      blast: process.env.BLASTSCAN_KEY || "",
      bsc: process.env.BSCSCAN_KEY || "",
      berachain: process.env.BERASCAN_KEY || "",
      linea: process.env.LINEASCAN_KEY || "",
      optimisticEthereum: process.env.OP_ETHERSCAN_KEY || "",
      scroll: process.env.SCROLLSCAN_KEY || "",
      arbitrumOne: process.env.ARBISCAN_KEY || "",
      xlayer: "test",
    },
    customChains: [
      {
        network: "xlayer",
        chainId: 196,
        urls: {
          apiURL:
            "https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER",
          browserURL: "https://www.oklink.com/xlayer",
        },
      },
      {
        network: "berachain",
        chainId: 80094,
        urls: {
          apiURL: "https://api.berascan.com/api",
          browserURL: "https://berascan.com",
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
      {
        network: "blast",
        chainId: 81457,
        urls: {
          apiURL: "https://api.blastscan.io/api",
          browserURL: "https://blastscan.io",
        },
      },
      {
        network: "scroll",
        chainId: 534352,
        urls: {
          apiURL: "https://api.scrollscan.com/api",
          browserURL: "https://scrollscan.com",
        },
      },
    ],
  },
};

export default config;
