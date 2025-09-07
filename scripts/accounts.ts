import hre from "hardhat";
const { ethers } = hre;

async function main() {
  const accounts = await ethers.getSigners();
  
  console.log("Available test accounts:");
  console.log("========================");
  
  for (let i = 0; i < Math.min(accounts.length, 10); i++) {
    const account = accounts[i];
    const balance = await ethers.provider.getBalance(account.address);
    
    console.log(`Account ${i}:`);
    console.log(`  Address: ${account.address}`);
    console.log(`  Balance: ${ethers.formatEther(balance)} ETH`);
    console.log("");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});