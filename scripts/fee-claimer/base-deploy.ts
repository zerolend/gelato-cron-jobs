import hre from "hardhat";

// An example of a deploy script that will deploy and call a simple contract.
const main = async function () {
  console.log(`Running deploy script for FeesClaimer`);

  // Create deployer object and load the artifact of the contract you want to deploy.

  // Estimate contract deployment fee
  const args: any[] = [
    "----", // IPoolAddressesProvider _provider,
    "----", // address _collector,
    "----", // address _destination,
    [], // address[] memory _tokens
  ];

  const factory = await hre.viem.deployContract("FeesClaimer", args);
  console.log(`deployed to ${factory.address}`);

  // verify contract for tesnet & mainnet
  if (process.env.NODE_ENV != "test") {
    // Verify contract programmatically
    await hre.run("verify:verify", {
      address: factory.address,
      constructorArguments: args,
    });
  } else {
    console.log(`Contract not verified, deployed locally.`);
  }
};

main();
