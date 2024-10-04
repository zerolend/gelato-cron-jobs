import hre from "hardhat";
import { deployContract, deployProxy, waitForTx } from "../utils";
import assert from "assert";

// An example of a deploy script that will deploy and call a simple contract.
const main = async function () {
  assert(hre.network.name === "base", "This script should only be run on base");
  console.log(`Running update script for FeesClaimerBase`);

  const [deployer] = await hre.ethers.getSigners();
  console.log("i am", deployer.address);

  const contractD = await deployContract(
    hre,
    "FeesClaimerBase",
    [],
    "FeesClaimerBase-Impl",
    true // force deploy
  );

  const contract = await hre.ethers.getContractAt(
    "FeesClaimerBase",
    contractD.address
  );

  const data = await contract.initialize.populateTransaction(
    "0x5213ab3997a596c75Ac6ebF81f8aEb9cf9A31007", // IPoolAddressesProvider _provider,
    "0x6F5Ae60d89dbbc4EeD4B08d08A68dD5679Ac61B4", // address _collector,
    "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", // address _wethOrTargetAsset,
    "0x19cEeAd7105607Cd444F5ad10dd51356436095a1", // address _odos,
    [
      // address[] memory _tokens,
      "0x4200000000000000000000000000000000000006",
      "0x940181a94A35A4569E4529A3CDfB74e38FD98631",
      "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      "0x0A27E060C0406f8Ab7B64e3BEE036a37e5a62853",
      "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
      "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf",
    ],
    "0xcb26c67ece9d7bbdb0205ee4c33f8503a0346134", // address _gelatoooooo,
    "0x0F6e98A756A40dD050dC78959f45559F98d3289d" // address _owner,
  );

  console.log("init data", data);
};

main();
