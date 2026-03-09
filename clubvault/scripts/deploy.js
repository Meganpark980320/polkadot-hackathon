import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {
  const ClubVault = await ethers.getContractFactory("ClubVault");
  const clubVault = await ClubVault.deploy();
  await clubVault.waitForDeployment();

  console.log("ClubVault deployed");
  console.log(`address=${await clubVault.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
