import hre from "hardhat";

// An example of a deploy script that will deploy and call a simple contract.
const main = async function () {
  console.log(`Running deploy script for FeesClaimer`);

  const claimer = await hre.viem.getContractAt(
    "FeesClaimer",
    "0x309cfe19f7963d0fc355e6acb1f82299a8cc76eb"
  );

  const dataprovider = await hre.viem.getContractAt(
    "IPoolDataProvider",
    "0x67f93d36792c49a4493652B91ad4bD59f428AD15"
  );

  // console.log(`deployed to ${factory.address}`);

  const tokens = await dataprovider.read.getAllReservesTokens();

  const addresses: {
    symbol: string;
    address: string;
    aToken: string;
  }[] = [];

  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index];
    const addr: any = token.tokenAddress;

    const config = await dataprovider.read.getReserveConfigurationData([addr]);
    if (!config[6]) continue; // if borrowing is enabled

    const [aToken] = await dataprovider.read.getReserveTokensAddresses([addr]);

    addresses.push({
      symbol: token.symbol,
      address: token.tokenAddress,
      aToken: aToken,
    });
  }

  const addrs = addresses.map((a) => a.address) as `0x${string}`[];
  const atokens = addresses.map((a) => a.aToken) as `0x${string}`[];
  const tx = await claimer.write.setTokens([addrs, atokens]);
  console.log(tx);

  // // verify contract for tesnet & mainnet
  // if (process.env.NODE_ENV != "test") {
  //   // Verify contract programmatically
  //   await hre.run("verify:verify", {
  //     address: "0x309cfe19f7963d0fc355e6acb1f82299a8cc76eb",
  //     constructorArguments: args,
  //   });
  // } else {
  //   console.log(`Contract not verified, deployed locally.`);
  // }
};

main();
