import { Wallet } from "zksync-web3";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// load env file
import dotenv from "dotenv";
dotenv.config();

// load wallet private key from env file
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

if (!PRIVATE_KEY)
  throw "⛔️ Private key not detected! Add it to the .env file!";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for FeesClaimer`);

  // Initialize the wallet.
  const wallet = new Wallet(PRIVATE_KEY);

  // Create deployer object and load the artifact of the contract you want to deploy.
  const deployer = new Deployer(hre, wallet);
  console.log(wallet.address);
  const artifact = await deployer.loadArtifact("FeesClaimer");

  // Estimate contract deployment fee
  const args: any[] = [
    "0xE52540DBD350c611A1B9c51E97e2A6bc16c09133", // address _collector,
    "0x1890F9204882dfa1B8f0AEaF56ae9b2ed149D18d", // address _destination,
    "0x4d9429246EA989C9CeE203B43F6d1C7D83e3B8F8", // IPool _pool,
    [], // address[] memory _tokens,
    [], // IERC20[] memory _aTokens
  ];

  const greeterContract = await deployer.deploy(artifact, args);

  //obtain the Constructor Arguments
  console.log(
    "Constructor args:" + greeterContract.interface.encodeDeploy(args)
  );

  // Show the contract info.
  const contractAddress = greeterContract.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);

  // verify contract for tesnet & mainnet
  if (process.env.NODE_ENV != "test") {
    // Verify contract programmatically
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
      bytecode: artifact.bytecode,
    });
  } else {
    console.log(`Contract not verified, deployed locally.`);
  }
}
