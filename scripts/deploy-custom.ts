import hre from "hardhat";

async function main() {
  const ethers = (hre as any).ethers;
  
  // Get command line arguments
  const args = process.argv.slice(2);
  
  if (args.length < 4) {
    console.log("Usage: npx hardhat run scripts/deploy-custom.ts --network shared -- <producerAddress> <supermarketAddress> <orderValue> <trackingId>");
    console.log("Example: npx hardhat run scripts/deploy-custom.ts --network shared -- 0x123... 0x456... 1500 TRACK789");
    process.exit(1);
  }

  const [deployer] = await ethers.getSigners();
  const [producerAddr, supermarketAddr, orderValue, trackingId] = args;

  console.log("Deploying with account:", deployer.address);
  console.log("Producer Address:", producerAddr);
  console.log("Supermarket Address:", supermarketAddr);
  console.log("Order Value:", orderValue);
  console.log("Tracking ID:", trackingId);

  const DeliveryEscrow = await ethers.getContractFactory("DeliveryEscrow");
  
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