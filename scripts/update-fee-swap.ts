import hre from "hardhat";
import { encodeFunctionData } from "viem";

// An example of a deploy script that will deploy and call a simple contract.
const main = async function () {
  console.log(`Running deploy script for FeesBuybackBurn`);

  // Create deployer object and load the artifact of the contract you want to deploy.
  const client = hre.viem.getPublicClient();

  const _provider =
    "0xC44827C51d00381ed4C52646aeAB45b455d200eB" as `0x${string}`; // IPoolAddressesProvider _provider,
  const _collector =
    "0x89fEc31daD373922879bd6279ccDc3666c5D1b7a" as `0x${string}`; // address _collector,
  const _weth = "0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f" as `0x${string}`; // address _weth,
  const _odos = "0x2d8879046f1559E53eb052E949e9544bCB72f414" as `0x${string}`; // address _odos,
  const _gelly = "0xcb26c67ece9d7bbdb0205ee4c33f8503a0346134" as `0x${string}`; // address _odos,
  const _staker = "0x0374ae8e866723adae4a62dce376129f292369b4";
  const _tokens = [
    "0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f",
    "0x4af15ec2a0bd43db75dd04e62faa3b8ef36b00d5",
    "0x176211869ca2b568f2a7d4ee941e073a821ee1ff",
    "0xa219439258ca9da29e9cc4ce5596924745e12b93",
    "0x3aab2285ddcddad8edf438c1bab47e1a9d05a9b4",
    "0xb5bedd42000b71fdde22d3ee8a79bd49a568fc8f",
  ] as `0x${string}`[]; // address[] memory _tokens

  const safe = "0x14aAD4668de2115e30A5FeeE42CFa436899CCD8A";
  const deployer = "0x0F6e98A756A40dD050dC78959f45559F98d3289d";
  // const factory = await hre.viem.deployContract("FeesClaimSwap");
  // console.log(`impl deployed to ${factory.address}`);

  const impl = await hre.viem.getContractAt(
    "FeesClaimSwap",
    "0xc0400264e71fc9367719be7badf228eac8fedab4"
  );

  const proxy = await hre.viem.getContractAt(
    "ITransparentUpgradeableProxy",
    "0x1e6b04f6c1e5173a17162edf59b7ce3a1a2ddf71"
  );

  // const contract = await hre.viem.getContractAt("FeesClaimSwap", proxy.address);
  // console.log(`contract deployed to ${contract.address}`);

  const d = encodeFunctionData({
    abi: impl.abi,
    functionName: "init",
    args: [
      _provider,
      _collector,
      _weth,
      _odos,
      _tokens,
      _gelly,
      _staker,
      deployer,
    ],
  });
  console.log("init", d);
  // (await hre.viem.getPublicClient()).waitForTransactionReceipt({ hash: tx });
};

main();
