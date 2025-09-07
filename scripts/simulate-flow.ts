import hre from "hardhat";
const { ethers } = hre;

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    console.log("Please set CONTRACT_ADDRESS environment variable");
    return;
  }

  // Dummy wallet private keys (replace with your generated ones)
  const PRODUCER_PRIVATE_KEY = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
  const SUPERMARKET_PRIVATE_KEY = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a";
  
  const provider = ethers.provider;
  
  // Connect dummy wallets
  const producerWallet = new ethers.Wallet(PRODUCER_PRIVATE_KEY, provider);
  const supermarketWallet = new ethers.Wallet(SUPERMARKET_PRIVATE_KEY, provider);
  
  const escrow = await ethers.getContractAt("DeliveryEscrow", contractAddress);
  
  console.log("Simulating delivery flow with dummy wallets...\n");
  
  // Check initial status
  console.log("Initial status:", await escrow.status());
  
  // Producer marks as shipped
  console.log("Producer marking as shipped...");
  await escrow.connect(producerWallet).markShipped();
  console.log("Status after shipping:", await escrow.status());
  
  // Supermarket confirms delivery
  console.log("Supermarket confirming delivery...");
  await escrow.connect(supermarketWallet).confirmDelivery();
  console.log("Final status:", await escrow.status());
  
  console.log("\nDelivery flow completed!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});