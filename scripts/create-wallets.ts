import hre from "hardhat";

async function main() {
  console.log("Creating dummy wallets for testing...\n");
  
  // Create dummy wallets
  const producerWallet = hre.ethers.Wallet.createRandom();
  const supermarketWallet = hre.ethers.Wallet.createRandom();
  
  console.log("PRODUCER WALLET:");
  console.log("Address:", producerWallet.address);
  console.log("Private Key:", producerWallet.privateKey);
  console.log("");
  
  console.log("SUPERMARKET WALLET:");
  console.log("Address:", supermarketWallet.address);
  console.log("Private Key:", supermarketWallet.privateKey);
  console.log("");
  
  console.log("Copy this to your .env file:");
  console.log(`PRODUCER_ADDRESS=${producerWallet.address}`);
  console.log(`PRODUCER_PRIVATE_KEY=${producerWallet.privateKey}`);
  console.log(`SUPERMARKET_ADDRESS=${supermarketWallet.address}`);
  console.log(`SUPERMARKET_PRIVATE_KEY=${supermarketWallet.privateKey}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});