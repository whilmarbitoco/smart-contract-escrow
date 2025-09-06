import { ethers } from "hardhat";

async function main() {
  const [admin] = await ethers.getSigners();
  
  console.log("Deploying CentralizedEscrow with admin:", admin.address);
  
  const CentralizedEscrow = await ethers.getContractFactory("CentralizedEscrow");
  const escrow = await CentralizedEscrow.deploy();
  
  await escrow.waitForDeployment();
  
  console.log("CentralizedEscrow deployed to:", escrow.target);
  console.log("Admin wallet controls all operations");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});