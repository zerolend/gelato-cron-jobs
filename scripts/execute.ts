import hre from "hardhat";

// An example of a deploy script that will deploy and call a simple contract.
const main = async function () {
  console.log(`Running deploy script for FeesClaimer`);

  const claimer = await hre.viem.getContractAt(
    "FeesClaimer",
    "0x309cfe19f7963d0fc355e6acb1f82299a8cc76eb"
  );

  const tx = await claimer.write.execute();
  console.log(tx);
};

main();
