import {
  createPublicClient,
  createWalletClient,
  custom,
  formatEther,
  http,
  parseEther
} from "viem";
import { clubVaultAbi } from "./clubvaultAbi";

export function hasBrowserWallet() {
  return typeof window !== "undefined" && typeof window.ethereum !== "undefined";
}

export async function getConnectedWalletAddress() {
  if (!hasBrowserWallet()) {
    return "";
  }

  const accounts = await window.ethereum.request({
    method: "eth_accounts"
  });

  return accounts[0] || "";
}

export async function getCurrentChainId() {
  if (!hasBrowserWallet()) {
    return null;
  }

  const chainIdHex = await window.ethereum.request({
    method: "eth_chainId"
  });

  return Number(BigInt(chainIdHex));
}

export async function connectWallet() {
  const [address] = await window.ethereum.request({
    method: "eth_requestAccounts"
  });

  return address;
}

export async function getLatestVaultId(contractAddress) {
  const client = getPublicClient();
  if (client == null) {
    throw new Error("No RPC transport available.");
  }

  return client.readContract({
    address: contractAddress,
    abi: clubVaultAbi,
    functionName: "vaultCount"
  });
}

export async function loadVaultSnapshot(contractAddress, vaultId = 1n) {
  const client = getPublicClient();
  if (client == null) {
    throw new Error("No RPC transport available.");
  }

  const vault = await client.readContract({
    address: contractAddress,
    abi: clubVaultAbi,
    functionName: "getVault",
    args: [vaultId]
  });

  const proposalIds = await client.readContract({
    address: contractAddress,
    abi: clubVaultAbi,
    functionName: "getVaultProposalIds",
    args: [vaultId]
  });

  const proposalRows = await Promise.all(
    proposalIds.map((proposalId) =>
      client.readContract({
        address: contractAddress,
        abi: clubVaultAbi,
        functionName: "getProposal",
        args: [proposalId]
      })
    )
  );

  const thresholdCount = Number(vault[1]);
  const memberCount = Number(vault[2]);
  const symbol = import.meta.env.VITE_NATIVE_SYMBOL || "DOT";

  return {
    vault: {
      name: vault[0],
      balance: `${formatEther(vault[3])} ${symbol}`,
      memberCount,
      threshold: `${thresholdCount} / ${memberCount} approvals`,
      thresholdCount
    },
    proposals: proposalRows
      .map((proposal, index) => {
        const approvalCount = Number(proposal[6]);
        const status = mapProposalStatus(proposal[7], approvalCount, thresholdCount);

        return {
          id: Number(proposalIds[index]),
          title: proposal[4],
          description: proposal[5],
          amount: `${formatEther(proposal[3])} ${symbol}`,
          amountValue: formatEther(proposal[3]),
          proposer: shortenAddress(proposal[1]),
          proposerAddress: proposal[1],
          recipient: shortenAddress(proposal[2]),
          recipientAddress: proposal[2],
          approvals: `${approvalCount} / ${thresholdCount}`,
          approvalCount,
          status,
          canExecute: status === "Ready to execute"
        };
      })
      .reverse()
  };
}

export async function createVaultTx({
  contractAddress,
  account,
  name,
  members,
  onSubmitted
}) {
  return writeContractTx({
    contractAddress,
    account,
    functionName: "createVault",
    args: [name, members],
    onSubmitted
  });
}

export async function depositToVaultTx({
  contractAddress,
  account,
  vaultId,
  amount,
  onSubmitted
}) {
  return writeContractTx({
    contractAddress,
    account,
    functionName: "deposit",
    args: [vaultId],
    value: parseEther(amount),
    onSubmitted
  });
}

export async function createProposalTx({
  contractAddress,
  account,
  vaultId,
  recipient,
  amount,
  title,
  description,
  onSubmitted
}) {
  return writeContractTx({
    contractAddress,
    account,
    functionName: "createProposal",
    args: [vaultId, recipient, parseEther(amount), title, description],
    onSubmitted
  });
}

export async function approveProposalTx({
  contractAddress,
  account,
  proposalId,
  onSubmitted
}) {
  return writeContractTx({
    contractAddress,
    account,
    functionName: "approveProposal",
    args: [proposalId],
    onSubmitted
  });
}

export async function executeProposalTx({
  contractAddress,
  account,
  proposalId,
  onSubmitted
}) {
  return writeContractTx({
    contractAddress,
    account,
    functionName: "executeProposal",
    args: [proposalId],
    onSubmitted
  });
}

export async function cancelProposalTx({
  contractAddress,
  account,
  proposalId,
  onSubmitted
}) {
  return writeContractTx({
    contractAddress,
    account,
    functionName: "cancelProposal",
    args: [proposalId],
    onSubmitted
  });
}

function getPublicClient() {
  if (import.meta.env.VITE_RPC_URL) {
    return createPublicClient({
      transport: http(import.meta.env.VITE_RPC_URL)
    });
  }

  if (hasBrowserWallet()) {
    return createPublicClient({
      transport: custom(window.ethereum)
    });
  }

  return null;
}

function getWalletClient() {
  if (!hasBrowserWallet()) {
    return null;
  }

  return createWalletClient({
    transport: custom(window.ethereum)
  });
}

async function writeContractTx({
  contractAddress,
  account,
  functionName,
  args,
  value = 0n,
  onSubmitted
}) {
  const walletClient = getWalletClient();
  const publicClient = getPublicClient();

  if (walletClient == null) {
    throw new Error("No browser wallet detected.");
  }
  if (publicClient == null) {
    throw new Error("No RPC transport available.");
  }

  const txHash = await walletClient.writeContract({
    account,
    address: contractAddress,
    abi: clubVaultAbi,
    functionName,
    args,
    value
  });

  onSubmitted?.(txHash);
  await publicClient.waitForTransactionReceipt({ hash: txHash });

  return txHash;
}

function mapProposalStatus(status, approvalCount, thresholdCount) {
  const value = Number(status);
  if (value === 1) return "Executed";
  if (value === 2) return "Cancelled";
  if (approvalCount >= thresholdCount) return "Ready to execute";
  return "Pending";
}

function shortenAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
