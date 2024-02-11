import hre from "hardhat";

// An example of a deploy script that will deploy and call a simple contract.
const main = async function () {
  console.log(`Running deploy script for FeesClaimer`);

  // Create deployer object and load the artifact of the contract you want to deploy.

  // Estimate contract deployment fee
  const args: any[] = [
    "0x97e59722318F1324008484ACA9C343863792cBf6", // address _collector,
    "0x0F6e98A756A40dD050dC78959f45559F98d3289d", // address _destination,
    "0x2f9bB73a8e98793e26Cb2F6C4ad037BDf1C6B269", // IPool _pool,
    [], // address[] memory _tokens,
    [], // IERC20[] memory _aTokens
  ];

  // const factory = await hre.viem.deployContract("FeesClaimer", args);

  // console.log(`deployed to ${factory.address}`);

  // verify contract for tesnet & mainnet
  if (process.env.NODE_ENV != "test") {
    // Verify contract programmatically
    await hre.run("verify:verify", {
      address: "0x309cfe19f7963d0fc355e6acb1f82299a8cc76eb",
      constructorArguments: args,
    });
  } else {
    console.log(`Contract not verified, deployed locally.`);
  }
};

main();
