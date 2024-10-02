import hre from "hardhat";
import { deployProxy, waitForTx } from "../utils";
import assert from "assert";

// An example of a deploy script that will deploy and call a simple contract.
const main = async function () {
  assert(hre.network.name === "base", "This script should only be run on base");
  console.log(`Running deploy script for FeesClaimerLinea`);

  const [deployer] = await hre.ethers.getSigners();
  console.log("i am", deployer.address);

  const safe = "---";
  const contractD = await deployProxy(
    hre,
    "FeesClaimerLinea",
    [
      "---", // IPoolAddressesProvider _provider,
      "---", // address _collector,
      "---", // address _wethOrTargetAsset,
      "---", // address _odos,
      [
        // address[] memory _tokens,
        // todo
      ],
      "0xcb26c67ece9d7bbdb0205ee4c33f8503a0346134", // address _gelatoooooo,
      "0x0F6e98A756A40dD050dC78959f45559F98d3289d", // address _owner,
    ],
    safe,
    "FeesClaimer"
  );

  const contract = await hre.ethers.getContractAt(
    "FeesClaimerLinea",
    contractD.address
  );

  await waitForTx(
    await contract.setAddresses(
      "0x0F6e98A756A40dD050dC78959f45559F98d3289d", // address _treasury,
      "---" // address _zlpStaker,
    )
  );

  await waitForTx(
    await contract.setPercentages(
      "500000000000000000" // uint256 _treasuryPercentage, - 50%
    )
  );
};

main();
