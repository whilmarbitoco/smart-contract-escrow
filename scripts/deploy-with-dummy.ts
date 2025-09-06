import { ethers } from "hardhat";

async function main() {
  // Use dummy wallet addresses (replace with actual generated ones)
  const PRODUCER_ADDRESS = "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87";
  const SUPERMARKET_ADDRESS = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
  
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying with dummy wallets:");
  console.log("Deployer:", deployer.address);
  console.log("Producer (dummy):", PRODUCER_ADDRESS);
  console.log("Supermarket (dummy):", SUPERMARKET_ADDRESS);
  
  const DeliveryEscrow = await ethers.getContractFactory("DeliveryEscrow");
  
  const escrow = await DeliveryEscrow.deploy(
    PRODUCER_ADDRESS,
    SUPERMARKET_ADDRESS,
    1000, // Order value reference
    "DUMMY_TRACK_123"
  );
  
  await escrow.waitForDeployment();
  
  console.log("DeliveryEscrow deployed to:", escrow.target);
  console.log("Use dummy private keys to interact with contract");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});