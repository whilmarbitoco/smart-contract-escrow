import { ethers } from "hardhat";

async function main() {
  // Hardhat gives you 20 local accounts automatically
  const [deployer, producer, supermarket] = await ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);
  console.log("Producer:", producer.address);
  console.log("Supermarket:", supermarket.address);

  const DeliveryEscrow = await ethers.getContractFactory("DeliveryEscrow");

  // Example values (amount + trackingId)
  const amount = 5000; 
  const trackingId = "TRK123";

  // Pass actual signer addresses from Hardhat
  const escrow = await DeliveryEscrow.deploy(
    producer.address,
    supermarket.address,
    amount,
    trackingId
  );

  await escrow.deployed();

  console.log("DeliveryEscrow deployed to:", escrow.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
