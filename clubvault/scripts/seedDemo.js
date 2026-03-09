import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {
  const [owner, alice, bob, recipient] = await ethers.getSigners();
  const ClubVault = await ethers.getContractFactory("ClubVault");
  const clubVault = await ClubVault.deploy();
  await clubVault.waitForDeployment();

  await (
    await clubVault.createVault("Demo Team Vault", [alice.address, bob.address])
  ).wait();

  await (
    await clubVault.deposit(1, {
      value: ethers.parseEther("1")
    })
  ).wait();

  await (
    await clubVault
      .connect(alice)
      .createProposal(
        1,
        recipient.address,
        ethers.parseEther("0.3"),
        "Snacks budget",
        "Buy snacks and drinks for the final demo session"
      )
  ).wait();

  await (await clubVault.connect(alice).approveProposal(1)).wait();
  await (await clubVault.connect(bob).approveProposal(1)).wait();

  console.log("ClubVault demo seed complete");
  console.log(`contract=${await clubVault.getAddress()}`);
  console.log(`vaultId=1`);
  console.log(`proposalId=1`);
  console.log(`owner=${owner.address}`);
  console.log(`alice=${alice.address}`);
  console.log(`bob=${bob.address}`);
  console.log(`recipient=${recipient.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
