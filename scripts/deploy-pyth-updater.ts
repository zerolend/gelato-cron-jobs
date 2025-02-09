import hre from "hardhat";

const pythContracts: { [key: string]: `0x${string}` } = {
  manta: "0xA2aa501b19aff244D90cc15a4Cf739D2725B5729",
  base: "0x8250f4aF4B972684F7b336503E2D6dFeDeB1487a",
  zksync: "0xf087c864AEccFb6A2Bf1Af6A0382B0d0f6c5D834",
  mainnet: "0x4305fb66699c3b2702d4d05cf36551390a4c69c6",
  berachain: "0x2880ab155794e7179c9ee2e38200202908c17b43",
  blastSepolia: "0xA2aa501b19aff244D90cc15a4Cf739D2725B5729",
  linea: "0xA2aa501b19aff244D90cc15a4Cf739D2725B5729",
  blast: "0xA2aa501b19aff244D90cc15a4Cf739D2725B5729",
};

// An example of a deploy script that will deploy and call a simple contract.
const main = async function () {
  console.log(`Running deploy script for PythUpdater`);

  const factory = await hre.ethers.getContractFactory("PythUpdater");

  // const contract = await factory.deploy(pythContracts[hre.network.name]);
  // console.log(`updater deployed to ${contract.target}`);

  // verify contract for tesnet & mainnet
  if (process.env.NODE_ENV != "test") {
    // Verify contract programmatically
    await hre.run("verify:verify", {
      address: "0xf361C14c0a6efa79B487b814346930d31E3D5214",
      constructorArguments: [pythContracts[hre.network.name]],
    });
  } else {
    console.log(`Contract not verified, deployed locally.`);
  }
};

main();
