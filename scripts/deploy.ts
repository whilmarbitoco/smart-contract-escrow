import hre from "hardhat";

async function main() {
  // Hardhat gives you 20 local accounts automatically
  const [deployer, producer, supermarket] = await hre.ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);
  console.log("Producer:", producer.address);
  console.log("Supermarket:", supermarket.address);

  const DeliveryEscrow = await hre.ethers.getContractFactory("DeliveryEscrow");

  // Status tracking only - payment handled off-chain
  const orderValue = 5000; // Reference value (not actual ETH)
  const trackingId = "TRK123";

  // Pass actual signer addresses from Hardhat
  const escrow = await DeliveryEscrow.deploy(
    producer.address,
    supermarket.address,
    orderValue,
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
