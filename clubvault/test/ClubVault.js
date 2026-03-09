import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("ClubVault", function () {
  async function deployFixture() {
    const [owner, alice, bob, carol, outsider, recipient] = await ethers.getSigners();
    const ClubVault = await ethers.getContractFactory("ClubVault");
    const clubVault = await ClubVault.deploy();
    await clubVault.waitForDeployment();

    return { clubVault, owner, alice, bob, carol, outsider, recipient };
  }

  async function createVaultWithMembers(clubVault, creator, members) {
    const tx = await clubVault.connect(creator).createVault("Hackathon Team", members);
    await tx.wait();
    return 1n;
  }

  describe("vault creation", function () {
    it("creates a vault and includes creator as a member", async function () {
      const { clubVault, owner, alice, bob } = await deployFixture();
      await createVaultWithMembers(clubVault, owner, [alice.address, bob.address]);

      const vault = await clubVault.getVault(1);
      const members = await clubVault.getVaultMembers(1);

      expect(vault[0]).to.equal("Hackathon Team");
      expect(vault[1]).to.equal(2n);
      expect(vault[2]).to.equal(3n);
      expect(members.length).to.equal(3);
      expect(await clubVault.isVaultMember(1, owner.address)).to.equal(true);
    });

    it("rejects duplicate members", async function () {
      const { clubVault, alice } = await deployFixture();
      await expect(
        clubVault.createVault("Bad Vault", [alice.address, alice.address])
      ).to.be.rejectedWith("DuplicateMember");
    });
  });

  describe("deposits", function () {
    it("allows members to deposit", async function () {
      const { clubVault, owner, alice } = await deployFixture();
      await createVaultWithMembers(clubVault, owner, [alice.address]);

      await clubVault.connect(alice).deposit(1, { value: ethers.parseEther("1") });
      const vault = await clubVault.getVault(1);

      expect(vault[3]).to.equal(ethers.parseEther("1"));
    });

    it("rejects deposits from outsiders", async function () {
      const { clubVault, owner, outsider } = await deployFixture();
      await createVaultWithMembers(clubVault, owner, []);

      await expect(
        clubVault.connect(outsider).deposit(1, { value: 1n })
      ).to.be.rejectedWith("NotVaultMember");
    });
  });

  describe("proposal flow", function () {
    it("creates, approves and executes a proposal after majority approval", async function () {
      const { clubVault, owner, alice, bob, recipient } = await deployFixture();
      await createVaultWithMembers(clubVault, owner, [alice.address, bob.address]);
      await clubVault.deposit(1, { value: ethers.parseEther("2") });

      await clubVault
        .connect(alice)
        .createProposal(
          1,
          recipient.address,
          ethers.parseEther("1"),
          "Snacks budget",
          "Buy snacks for the demo room"
        );

      await expect(clubVault.executeProposal(1)).to.be.rejectedWith("InsufficientApprovals");

      await clubVault.connect(alice).approveProposal(1);
      await clubVault.connect(bob).approveProposal(1);

      const before = await ethers.provider.getBalance(recipient.address);
      await clubVault.executeProposal(1);
      const after = await ethers.provider.getBalance(recipient.address);

      const proposal = await clubVault.getProposal(1);
      const vault = await clubVault.getVault(1);

      expect(proposal[7]).to.equal(1n);
      expect(vault[3]).to.equal(ethers.parseEther("1"));
      expect(after - before).to.equal(ethers.parseEther("1"));
    });

    it("rejects duplicate approvals", async function () {
      const { clubVault, owner, alice, recipient } = await deployFixture();
      await createVaultWithMembers(clubVault, owner, [alice.address]);
      await clubVault.deposit(1, { value: ethers.parseEther("1") });
      await clubVault
        .connect(alice)
        .createProposal(1, recipient.address, ethers.parseEther("0.5"), "Food", "Team lunch");

      await clubVault.connect(alice).approveProposal(1);

      await expect(clubVault.connect(alice).approveProposal(1)).to.be.rejectedWith(
        "AlreadyApproved"
      );
    });

    it("allows proposer to cancel a pending proposal", async function () {
      const { clubVault, owner, alice, recipient } = await deployFixture();
      await createVaultWithMembers(clubVault, owner, [alice.address]);
      await clubVault.deposit(1, { value: ethers.parseEther("1") });
      await clubVault
        .connect(alice)
        .createProposal(1, recipient.address, ethers.parseEther("0.25"), "Design", "Poster fee");

      await clubVault.connect(alice).cancelProposal(1);

      const proposal = await clubVault.getProposal(1);
      expect(proposal[7]).to.equal(2n);
    });
  });
});
