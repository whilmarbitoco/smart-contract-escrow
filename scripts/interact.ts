import hre from "hardhat";
const { ethers } = hre;

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    console.log("Please set CONTRACT_ADDRESS environment variable");
    console.log("Example: CONTRACT_ADDRESS=0x... npm run interact");
    return;
  }

  const [, producer, supermarket] = await ethers.getSigners();
  const escrow = await ethers.getContractAt("DeliveryEscrow", contractAddress);

  console.log("Contract Address:", contractAddress);
  console.log("Producer:", producer.address);
  console.log("Supermarket:", supermarket.address);
  console.log("");

  // Check current status
  const status = await escrow.status();
  const statusNames = ["Pending", "InTransit", "Completed", "Failed"];
  console.log("Current Status:", statusNames[status]);
  console.log("Tracking ID:", await escrow.trackingId());
  console.log("Order Value:", await escrow.amount(), "(reference only)");
  console.log("");

  // Example interactions based on current status
  if (status === 0) { // Pending
    console.log("Available actions:");
    console.log("- Producer can mark as shipped");
    console.log("- Supermarket can mark as failed");
  } else if (status === 1) { // InTransit
    console.log("Available actions:");
    console.log("- Supermarket can confirm delivery");
    console.log("- Supermarket can mark as failed");
  } else {
    console.log("Escrow is finalized. No further actions available.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});