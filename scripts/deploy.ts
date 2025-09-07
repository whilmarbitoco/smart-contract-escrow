import { ethers } from "ethers";
import hre from "hardhat";

async function main() {
  // Use ethers from the ethers package for wallet creation
  // and hre for Hardhat-specific functionality
  
  // Create provider and signers
  const rpcUrl = process.env.DOCKER_ENV ? "http://localhost:8545" : "http://18.139.160.100:8545";
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  
  // Use the pre-configured accounts from hardhat config
  const deployerKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const producerKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
  const supermarketKey = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a";
  
  const deployer = new ethers.Wallet(deployerKey, provider);
  const producer = new ethers.Wallet(producerKey, provider);
  const supermarket = new ethers.Wallet(supermarketKey, provider);

  console.log("Deploying contracts with account:", deployer.address);
  console.log("Producer:", producer.address);
  console.log("Supermarket:", supermarket.address);

  // Load contract artifacts
  const contractArtifact = await hre.artifacts.readArtifact("DeliveryEscrow");
  const DeliveryEscrow = new ethers.ContractFactory(contractArtifact.abi, contractArtifact.bytecode, deployer);

  // Get parameters from command line or use defaults
  const producerAddr = process.env.PRODUCER_ADDRESS || producer.address;
  const supermarketAddr = process.env.SUPERMARKET_ADDRESS || supermarket.address;
  const orderValue = process.env.ORDER_VALUE || "1000";
  const trackingId = process.env.TRACKING_ID || `TRK${Date.now()}`;

  console.log("Deployment parameters:");
  console.log("Producer Address:", producerAddr);
  console.log("Supermarket Address:", supermarketAddr);
  console.log("Order Value:", orderValue);
  console.log("Tracking ID:", trackingId);

  const escrow = await DeliveryEscrow.deploy(
    producerAddr,
    supermarketAddr,
    parseInt(orderValue),
    trackingId
  );

  await escrow.waitForDeployment();

  console.log("DeliveryEscrow deployed to:", await escrow.getAddress());
  console.log("Transaction hash:", escrow.deploymentTransaction()?.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});