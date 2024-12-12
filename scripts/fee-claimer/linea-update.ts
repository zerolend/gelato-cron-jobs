import hre from "hardhat";
import { deployContract } from "../utils";

// An example of a deploy script that will deploy and call a simple contract.
const main = async function () {
  console.log(`Running deploy script for FeesClaimerLinea`);

  // Create deployer object and load the artifact of the contract you want to deploy.

  const _provider =
    "0xC44827C51d00381ed4C52646aeAB45b455d200eB" as `0x${string}`; // IPoolAddressesProvider _provider,
  const _collector =
    "0x89fEc31daD373922879bd6279ccDc3666c5D1b7a" as `0x${string}`; // address _collector,
  const _weth = "0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f" as `0x${string}`; // address _zero,
  const _odos = "0x2d8879046f1559E53eb052E949e9544bCB72f414" as `0x${string}`; // address _odos,
  const _gelly = "0xcb26c67ece9d7bbdb0205ee4c33f8503a0346134" as `0x${string}`; // address _odos,
  const _tokens = [
    "0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f",
    "0x4af15ec2a0bd43db75dd04e62faa3b8ef36b00d5",
    "0x176211869ca2b568f2a7d4ee941e073a821ee1ff",
    "0xa219439258ca9da29e9cc4ce5596924745e12b93",
    "0x3aab2285ddcddad8edf438c1bab47e1a9d05a9b4",
    "0xb5bedd42000b71fdde22d3ee8a79bd49a568fc8f",
  ] as `0x${string}`[]; // address[] memory _tokens

  // Estimate contract deployment fee
  const args = [
    _provider,
    _collector,
    _weth,
    _odos,
    _tokens, // address[] memory _tokens
    _gelly,
  ];

  const safe = "0x14aAD4668de2115e30A5FeeE42CFa436899CCD8A";
  const factory = await deployContract(
    hre,
    "FeesClaimerLinea",
    [],
    "FeesClaimerLinea"
  );
  console.log(`impl deployed to ${factory.address}`);

  const proxy = await hre.ethers.getContractAt(
    "FeesClaimerLinea",
    factory.address
  );
  console.log(
    "init code",
    await proxy.initialize.populateTransaction(
      _provider,
      _collector,
      _weth,
      _odos,
      _tokens, // address[] memory _tokens
      _gelly,
      "0x0F6e98A756A40dD050dC78959f45559F98d3289d"
    )
  );

  // const proxy = await hre.viem.getContractAt("ITransparentUpgradeableProxy", '');

  // const contract = await hre.viem.getContractAt("FeesClaimSwap", proxy.address);
  // console.log(`contract deployed to ${contract.address}`);

  // const tx = await contract.write.init([
  //   _provider,
  //   _collector,
  //   _zero,
  //   _odos,
  //   _tokens,
  //   _gelly,
  // ]);

  // console.log("init", tx);
  // (await hre.viem.getPublicClient()).waitForTransactionReceipt({ hash: tx });

  // verify contract for tesnet & mainnet
  if (process.env.NODE_ENV != "test") {
    // Verify contract programmatically
    await hre.run("verify:verify", {
      address: factory.address,
    });
    // await hre.run("verify:verify", {
    //   address: proxy.address,
    //   constructorArguments: [factory.address, safe, "0x"],
    // });
  } else {
    console.log(`Contract not verified, deployed locally.`);
  }
};

main();
