import hre from "hardhat";

const pythContracts: { [key: string]: string } = {
  manta: "0xA2aa501b19aff244D90cc15a4Cf739D2725B5729",
  zksync: "0xf087c864AEccFb6A2Bf1Af6A0382B0d0f6c5D834",
  blastSepolia: "0xA2aa501b19aff244D90cc15a4Cf739D2725B5729",
  linea: "0xA2aa501b19aff244D90cc15a4Cf739D2725B5729",
  blast: "0xA2aa501b19aff244D90cc15a4Cf739D2725B5729",
};

// An example of a deploy script that will deploy and call a simple contract.
const main = async function () {
  console.log(`Running deploy script for PythUpdater`);

  const factory = await hre.viem.deployContract("PythUpdater", [
    pythContracts[hre.network.name] as `0x${string}`,
  ]);
  console.log(`updater deployed to ${factory.address}`);

  // verify contract for tesnet & mainnet
  if (process.env.NODE_ENV != "test") {
    // Verify contract programmatically
    await hre.run("verify:verify", {
      address: factory.address,
      constructorArguments: [pythContracts[hre.network.name] as `0x${string}`],
    });
  } else {
    console.log(`Contract not verified, deployed locally.`);
  }
};

main();
