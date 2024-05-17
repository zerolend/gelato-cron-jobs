import hre from "hardhat";

// An example of a deploy script that will deploy and call a simple contract.
const main = async function () {
  console.log(`Running deploy script for FeesBuybackBurn`);

  // Create deployer object and load the artifact of the contract you want to deploy.
  const signers = await hre.viem.getWalletClients();

  const _provider =
    "0xC44827C51d00381ed4C52646aeAB45b455d200eB" as `0x${string}`; // IPoolAddressesProvider _provider,
  const _collector =
    "0x89fEc31daD373922879bd6279ccDc3666c5D1b7a" as `0x${string}`; // address _collector,
  const _zero = "0x78354f8dccb269a615a7e0a24f9b0718fdc3c7a7" as `0x${string}`; // address _zero,
  const _odos = "0x2d8879046f1559E53eb052E949e9544bCB72f414" as `0x${string}`; // address _odos,
  const _tokens = [
    "0xa219439258ca9da29e9cc4ce5596924745e12b93",
  ] as `0x${string}`[]; // address[] memory _tokens

  const factory = await hre.viem.deployContract("FeesBuybackBurn");
  console.log(`deployed to ${factory.address}`);

  const tx = await factory.write.init([
    _provider,
    _collector,
    _zero,
    _odos,
    _tokens,
  ]);
  console.log("init", tx);
};

main();
