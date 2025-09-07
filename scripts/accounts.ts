import hre from "hardhat";

async function main() {
  const accounts = await hre.ethers.getSigners();
  
  console.log("Available test accounts:");
  console.log("========================");
  
  for (let i = 0; i < Math.min(accounts.length, 10); i++) {
    const account = accounts[i];
    const balance = await hre.ethers.provider.getBalance(account.address);
    
    console.log(`Account ${i}:`);
    console.log(`  Address: ${account.address}`);
    console.log(`  Balance: ${hre.ethers.formatEther(balance)} ETH`);
    console.log("");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});