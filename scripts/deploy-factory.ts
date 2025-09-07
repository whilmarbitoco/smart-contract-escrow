import hre from "hardhat";

// Factory function to deploy multiple contracts
async function deployEscrow(producerAddr: string, supermarketAddr: string, orderValue: number, trackingId: string) {
  const ethers = (hre as any).ethers;
  const [deployer] = await ethers.getSigners();
  
  const DeliveryEscrow = await ethers.getContractFactory("DeliveryEscrow");
  
  const escrow = await DeliveryEscrow.deploy(
    producerAddr,
    supermarketAddr,
    orderValue,
    trackingId
  );

  await escrow.waitForDeployment();
  
  return {
    address: escrow.target,
    txHash: escrow.deploymentTransaction()?.hash,
    producer: producerAddr,
    supermarket: supermarketAddr,
    orderValue,
    trackingId
  };
}

async function main() {
  const ethers = (hre as any).ethers;
  const [deployer, producer1, supermarket1, producer2, supermarket2] = await ethers.getSigners();

  console.log("Deploying multiple escrow contracts...");
  console.log("Deployer:", deployer.address);

  // Deploy multiple contracts with different parameters
  const contracts = [];

  // Contract 1
  const contract1 = await deployEscrow(
    producer1.address,
    supermarket1.address,
    1000,
    "ORDER_001"
  );
  contracts.push(contract1);

  // Contract 2
  const contract2 = await deployEscrow(
    producer2.address,
    supermarket2.address,
    2500,
    "ORDER_002"
  );
  contracts.push(contract2);

  // Contract 3 - Same producer, different supermarket
  const contract3 = await deployEscrow(
    producer1.address,
    supermarket2.address,
    750,
    "ORDER_003"
  );
  contracts.push(contract3);

  console.log("\n=== Deployed Contracts ===");
  contracts.forEach((contract, index) => {
    console.log(`\nContract ${index + 1}:`);
    console.log(`  Address: ${contract.address}`);
    console.log(`  Producer: ${contract.producer}`);
    console.log(`  Supermarket: ${contract.supermarket}`);
    console.log(`  Order Value: ${contract.orderValue}`);
    console.log(`  Tracking ID: ${contract.trackingId}`);
    console.log(`  TX Hash: ${contract.txHash}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});