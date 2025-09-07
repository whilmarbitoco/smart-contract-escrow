import hre from "hardhat";

async function main() {
  // Access ethers through hre with type assertion
  const ethers = (hre as any).ethers;
  
  // Hardhat gives you 20 local accounts automatically
  const [deployer, producer, supermarket] = await ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);
  console.log("Producer:", producer.address);
  console.log("Supermarket:", supermarket.address);

  const DeliveryEscrow = await ethers.getContractFactory("DeliveryEscrow");

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

  console.log("DeliveryEscrow deployed to:", escrow.target);
  console.log("Transaction hash:", escrow.deploymentTransaction()?.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});