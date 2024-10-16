import hre from "hardhat";
import { deployProxy, waitForTx } from "../utils";
import assert from "assert";

// An example of a deploy script that will deploy and call a simple contract.
const main = async function () {
  assert(
    hre.network.name === "mainnet",
    "This script should only be run on mainnet"
  );
  console.log(`Running deploy script for FeesClaimerMainnetBtc`);

  const [deployer] = await hre.ethers.getSigners();
  console.log("i am", deployer.address);

  const safe = "0x4E88E72bd81C7EA394cB410296d99987c3A242fE";
  await deployProxy(
    hre,
    "FeesClaimerMainnetBtc",
    [
      "0x17878AFdD5772F4Ec93c265Ac7Ad8E2b29abB857", // IPoolAddressesProvider _provider,
      safe, // address _collector,
      "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf", // address _wethOrTargetAsset, - cbBTC
      "0xCf5540fFFCdC3d510B18bFcA6d2b9987b0772559", // address _odos,
      [
        // address[] memory _tokens,
        "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", // wbtc
        "0x657e8C867D8B37dCC18fA4Caead9C45EB088C642", // eBTC
        "0x8236a87084f8B84306f72007F36F2618A5634494", // lbtc
        "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf", // cbBTC
        "0xd9D920AA40f578ab794426F5C90F6C731D159DEf", // solvbtc
      ],
      "0xcb26c67ece9d7bbdb0205ee4c33f8503a0346134", // address _gelatoooooo,
      "0x0F6e98A756A40dD050dC78959f45559F98d3289d", // address _owner,
      safe, // address _treasury,
    ],
    safe,
    "FeesClaimerMainnetBtc"
  );
};

main();
