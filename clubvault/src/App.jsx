import { startTransition, useEffect, useMemo, useState } from "react";
import { isAddress } from "viem";
import {
  approveProposalTx,
  cancelProposalTx,
  connectWallet,
  createProposalTx,
  createVaultTx,
  depositToVaultTx,
  executeProposalTx,
  getCurrentChainId,
  getConnectedWalletAddress,
  getLatestVaultId,
  hasBrowserWallet,
  loadVaultSnapshot
} from "./lib/clubvaultClient";

const initialDraft = {
  title: "",
  description: "",
  amount: ""
};

const initialVaultForm = {
  name: "Hackathon Team Vault",
  members: ""
};

const initialProposalForm = {
  recipient: "",
  amount: "",
  title: "",
  description: ""
};

function App() {
  const contractAddress = import.meta.env.VITE_CLUBVAULT_ADDRESS || "";
  const nativeSymbol = import.meta.env.VITE_NATIVE_SYMBOL || "DOT";
  const explorerTxBaseUrl = import.meta.env.VITE_EXPLORER_TX_BASE_URL || "";
  const expectedChainId = Number(import.meta.env.VITE_POLKADOT_HUB_CHAIN_ID || "420420417");
  const expectedNetworkLabel = import.meta.env.VITE_POLKADOT_HUB_NETWORK_LABEL || "Polkadot Hub TestNet";
  const configuredVaultId = parseVaultId(import.meta.env.VITE_CLUBVAULT_VAULT_ID);
  const isLiveConfigured = Boolean(contractAddress);

  const [walletAddress, setWalletAddress] = useState("");
  const [activeChainId, setActiveChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vaultId, setVaultId] = useState(configuredVaultId);
  const [lastTxHash, setLastTxHash] = useState("");
  const [statusText, setStatusText] = useState(
    isLiveConfigured
      ? "Live mode configured. Connect wallet to load the latest vault."
      : "Demo mode active. Set VITE_CLUBVAULT_ADDRESS to enable onchain actions."
  );
  const [vault, setVault] = useState(() => createDemoVault(nativeSymbol));
  const [proposals, setProposals] = useState(() => createDemoProposals(nativeSymbol));
  const [prompt, setPrompt] = useState("Buy snacks for the team during demo prep, budget 30 DOT.");
  const [draft, setDraft] = useState(initialDraft);
  const [vaultForm, setVaultForm] = useState(initialVaultForm);
  const [depositAmount, setDepositAmount] = useState("");
  const [proposalForm, setProposalForm] = useState(initialProposalForm);

  const modeLabel = useMemo(() => {
    if (!isLiveConfigured) return "Demo mode";
    if (!walletAddress) return "Live mode configured";
    return "Live mode connected";
  }, [isLiveConfigured, walletAddress]);

  const activeVaultLabel = vaultId == null ? "No active vault" : `Vault #${vaultId.toString()}`;
  const isOnExpectedNetwork = activeChainId == null || activeChainId === expectedChainId;
  const canUseLiveActions = isLiveConfigured && Boolean(walletAddress) && isOnExpectedNetwork;
  const actionDisabled = !canUseLiveActions || isSubmitting;

  useEffect(() => {
    let active = true;

    if (!hasBrowserWallet()) {
      return () => {
        active = false;
      };
    }

    getConnectedWalletAddress()
      .then((address) => {
        if (active && address) {
          setWalletAddress(address);
        }
      })
      .catch(() => {});

    getCurrentChainId()
      .then((chainId) => {
        if (active) {
          setActiveChainId(chainId);
        }
      })
      .catch(() => {});

    const handleChainChanged = (chainIdHex) => {
      if (active) {
        setActiveChainId(Number(BigInt(chainIdHex)));
      }
    };

    const handleAccountsChanged = (accounts) => {
      if (!active) {
        return;
      }

      setWalletAddress(accounts[0] || "");
    };

    window.ethereum.on?.("chainChanged", handleChainChanged);
    window.ethereum.on?.("accountsChanged", handleAccountsChanged);

    return () => {
      active = false;
      window.ethereum.removeListener?.("chainChanged", handleChainChanged);
      window.ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
    };
  }, []);

  useEffect(() => {
    if (!isLiveConfigured || !walletAddress || !isOnExpectedNetwork) {
      return;
    }

    refreshLiveData();
  }, [contractAddress, isLiveConfigured, isOnExpectedNetwork, walletAddress]);

  useEffect(() => {
    if (!walletAddress || isOnExpectedNetwork) {
      return;
    }

    setStatusText(`Wallet is connected to the wrong network. Switch to ${expectedNetworkLabel}.`);
  }, [expectedNetworkLabel, isOnExpectedNetwork, walletAddress]);

  async function refreshLiveData(requestedVaultId = vaultId) {
    if (!isLiveConfigured) {
      return;
    }

    try {
      setIsSyncing(true);
      setStatusText("Loading vault data from contract...");

      const latestVaultId = await getLatestVaultId(contractAddress);
      if (latestVaultId === 0n) {
        startTransition(() => {
          setVaultId(null);
          setVault(createEmptyVault(nativeSymbol));
          setProposals([]);
        });
        setStatusText("Contract is live, but no vault has been created yet.");
        return;
      }

      const targetVaultId =
        requestedVaultId != null && requestedVaultId <= latestVaultId ? requestedVaultId : latestVaultId;
      const snapshot = await loadVaultSnapshot(contractAddress, targetVaultId);

      startTransition(() => {
        setVaultId(targetVaultId);
        setVault(snapshot.vault);
        setProposals(snapshot.proposals);
      });
      setStatusText(`Vault #${targetVaultId.toString()} loaded from contract.`);
    } catch (error) {
      setStatusText(`Live read failed: ${humanizeError(error)}`);
    } finally {
      setIsSyncing(false);
    }
  }

  function handleGenerateDraft() {
    const amountMatch = prompt.match(/(\d+(\.\d+)?)/);
    const amount = amountMatch ? amountMatch[1] : "";
    const normalized = prompt.trim();
    const title = normalized ? normalized.split(/[,.]/)[0].slice(0, 40) : "Treasury expense request";

    setDraft({
      title,
      amount,
      description: normalized || "Auto-generated draft proposal for a team expense."
    });
    setStatusText("AI draft generated locally from the prompt.");
  }

  function handleUseDraft() {
    setProposalForm((current) => ({
      ...current,
      title: draft.title || current.title,
      amount: draft.amount || current.amount,
      description: draft.description || current.description
    }));
    setStatusText("Draft copied into the proposal form.");
  }

  async function handleConnectWallet() {
    if (!hasBrowserWallet()) {
      setStatusText("No browser wallet detected. Staying in demo mode.");
      return;
    }

    try {
      setIsConnecting(true);
      const address = await connectWallet();
      setWalletAddress(address);
      setStatusText("Wallet connected.");
    } catch (error) {
      setStatusText(`Wallet connection failed: ${humanizeError(error)}`);
    } finally {
      setIsConnecting(false);
    }
  }

  async function handleCreateVault() {
    if (!guardLiveAction()) {
      return;
    }

    const name = vaultForm.name.trim();
    if (!name) {
      setStatusText("Vault name is required.");
      return;
    }

    let members;
    try {
      members = parseMemberList(vaultForm.members);
    } catch (error) {
      setStatusText(humanizeError(error));
      return;
    }

    try {
      setIsSubmitting(true);
      setStatusText("Create vault: awaiting wallet signature...");

      await createVaultTx({
        contractAddress,
        account: walletAddress,
        name,
        members,
        onSubmitted: (txHash) => {
          setLastTxHash(txHash);
          setStatusText(`Create vault submitted: ${shortenHash(txHash)}`);
        }
      });

      const nextVaultId = await getLatestVaultId(contractAddress);
      setVaultId(nextVaultId);
      await refreshLiveData(nextVaultId);
      setVaultForm(initialVaultForm);
      setStatusText(`Vault #${nextVaultId.toString()} created and synced.`);
    } catch (error) {
      setStatusText(`Create vault failed: ${humanizeError(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeposit() {
    if (!guardLiveAction()) {
      return;
    }
    if (vaultId == null) {
      setStatusText("Create a vault before depositing.");
      return;
    }
    if (!depositAmount.trim()) {
      setStatusText("Deposit amount is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setStatusText("Deposit: awaiting wallet signature...");

      await depositToVaultTx({
        contractAddress,
        account: walletAddress,
        vaultId,
        amount: depositAmount.trim(),
        onSubmitted: (txHash) => {
          setLastTxHash(txHash);
          setStatusText(`Deposit submitted: ${shortenHash(txHash)}`);
        }
      });

      await refreshLiveData(vaultId);
      setDepositAmount("");
      setStatusText("Deposit confirmed onchain.");
    } catch (error) {
      setStatusText(`Deposit failed: ${humanizeError(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCreateProposal() {
    if (!guardLiveAction()) {
      return;
    }
    if (vaultId == null) {
      setStatusText("Create a vault before submitting a proposal.");
      return;
    }
    if (!proposalForm.title.trim() || !proposalForm.description.trim()) {
      setStatusText("Proposal title and description are required.");
      return;
    }
    if (!proposalForm.amount.trim()) {
      setStatusText("Proposal amount is required.");
      return;
    }
    if (!isAddress(proposalForm.recipient.trim())) {
      setStatusText("Recipient must be a valid EVM address.");
      return;
    }

    try {
      setIsSubmitting(true);
      setStatusText("Create proposal: awaiting wallet signature...");

      await createProposalTx({
        contractAddress,
        account: walletAddress,
        vaultId,
        recipient: proposalForm.recipient.trim(),
        amount: proposalForm.amount.trim(),
        title: proposalForm.title.trim(),
        description: proposalForm.description.trim(),
        onSubmitted: (txHash) => {
          setLastTxHash(txHash);
          setStatusText(`Create proposal submitted: ${shortenHash(txHash)}`);
        }
      });

      await refreshLiveData(vaultId);
      setProposalForm(initialProposalForm);
      setStatusText("Proposal confirmed onchain.");
    } catch (error) {
      setStatusText(`Create proposal failed: ${humanizeError(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleApproveProposal(proposalId) {
    if (!guardLiveAction()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setStatusText("Approve proposal: awaiting wallet signature...");

      await approveProposalTx({
        contractAddress,
        account: walletAddress,
        proposalId: BigInt(proposalId),
        onSubmitted: (txHash) => {
          setLastTxHash(txHash);
          setStatusText(`Approval submitted: ${shortenHash(txHash)}`);
        }
      });

      await refreshLiveData(vaultId);
      setStatusText(`Proposal #${proposalId} approved onchain.`);
    } catch (error) {
      setStatusText(`Approve failed: ${humanizeError(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleExecuteProposal(proposalId) {
    if (!guardLiveAction()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setStatusText("Execute proposal: awaiting wallet signature...");

      await executeProposalTx({
        contractAddress,
        account: walletAddress,
        proposalId: BigInt(proposalId),
        onSubmitted: (txHash) => {
          setLastTxHash(txHash);
          setStatusText(`Execution submitted: ${shortenHash(txHash)}`);
        }
      });

      await refreshLiveData(vaultId);
      setStatusText(`Proposal #${proposalId} executed onchain.`);
    } catch (error) {
      setStatusText(`Execute failed: ${humanizeError(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCancelProposal(proposalId) {
    if (!guardLiveAction()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setStatusText("Cancel proposal: awaiting wallet signature...");

      await cancelProposalTx({
        contractAddress,
        account: walletAddress,
        proposalId: BigInt(proposalId),
        onSubmitted: (txHash) => {
          setLastTxHash(txHash);
          setStatusText(`Cancel submitted: ${shortenHash(txHash)}`);
        }
      });

      await refreshLiveData(vaultId);
      setStatusText(`Proposal #${proposalId} cancelled onchain.`);
    } catch (error) {
      setStatusText(`Cancel failed: ${humanizeError(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  function guardLiveAction() {
    if (!isLiveConfigured) {
      setStatusText("Set VITE_CLUBVAULT_ADDRESS to enable live actions.");
      return false;
    }
    if (!walletAddress) {
      setStatusText("Connect a wallet before sending transactions.");
      return false;
    }
    if (!isOnExpectedNetwork) {
      setStatusText(`Switch to ${expectedNetworkLabel} before sending transactions.`);
      return false;
    }
    return true;
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">Polkadot Solidity Hackathon 2026</div>
            <div className="banner-row">
              <span className="mode-badge">{modeLabel}</span>
              <span className="wallet-pill">{activeVaultLabel}</span>
              {isLiveConfigured ? <span className="wallet-pill">{shortenAddress(contractAddress)}</span> : null}
              {walletAddress ? <span className="wallet-pill">{shortenAddress(walletAddress)}</span> : null}
            </div>
            <h1>ClubVault</h1>
            <p className="subtitle">
              Shared treasury for student teams, with proposal-based spending and transparent execution.
            </p>
          </div>

          <div className="hero-panel">
            <div className="card-label">Live Status</div>
            <div className="network-row">
              <span className={`network-pill ${isOnExpectedNetwork ? "network-ok" : "network-warning"}`}>
                {activeChainId == null
                  ? "Network unknown"
                  : activeChainId === expectedChainId
                    ? `${expectedNetworkLabel} connected`
                    : `Wrong network: ${activeChainId}`}
              </span>
            </div>
            <p className="status-line">{statusText}</p>
            {!isOnExpectedNetwork ? (
              <p className="warning-text">
                Switch the wallet to {expectedNetworkLabel} before sending any ClubVault transaction.
              </p>
            ) : null}
            {lastTxHash ? (
              <div className="status-meta">
                <span className="wallet-pill">{shortenHash(lastTxHash)}</span>
                {explorerTxBaseUrl ? (
                  <a
                    className="tx-link"
                    href={`${explorerTxBaseUrl}${lastTxHash}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    View last tx
                  </a>
                ) : null}
              </div>
            ) : null}
            <div className="cta-row">
              <button
                className="primary-btn"
                disabled={!isLiveConfigured || isSyncing}
                onClick={() => refreshLiveData()}
                type="button"
              >
                {isSyncing ? "Refreshing..." : "Refresh Vault"}
              </button>
              <button className="secondary-btn" onClick={handleConnectWallet} type="button">
                {isConnecting ? "Connecting..." : walletAddress ? "Wallet Connected" : "Connect Wallet"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="card vault-card">
          <div className="card-label">Vault Overview</div>
          <h2>{vault.name}</h2>
          <div className="metric-stack">
            <div>
              <span className="metric-label">Balance</span>
              <strong>{vault.balance}</strong>
            </div>
            <div>
              <span className="metric-label">Members</span>
              <strong>{vault.memberCount}</strong>
            </div>
            <div>
              <span className="metric-label">Approval Rule</span>
              <strong>{vault.threshold}</strong>
            </div>
          </div>

          <div className="section-heading">Create vault</div>
          <div className="field-grid">
            <label className="field">
              <span className="field-label">Vault name</span>
              <input
                className="field-input"
                value={vaultForm.name}
                onChange={(event) =>
                  setVaultForm((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Hackathon Team Vault"
              />
            </label>
            <label className="field field-span">
              <span className="field-label">Members</span>
              <textarea
                className="field-input field-textarea"
                rows="3"
                value={vaultForm.members}
                onChange={(event) =>
                  setVaultForm((current) => ({ ...current, members: event.target.value }))
                }
                placeholder="One address per line or comma separated"
              />
            </label>
          </div>
          <div className="inline-actions">
            <button className="primary-btn" disabled={actionDisabled} onClick={handleCreateVault} type="button">
              Create Vault
            </button>
          </div>
          <p className="helper-text">Creator is always added automatically.</p>

          <div className="section-divider" />

          <div className="section-heading">Deposit</div>
          <div className="action-row">
            <input
              className="field-input"
              value={depositAmount}
              onChange={(event) => setDepositAmount(event.target.value)}
              placeholder="0.25"
            />
            <button className="secondary-btn" disabled={actionDisabled || vaultId == null} onClick={handleDeposit} type="button">
              Deposit
            </button>
          </div>
        </article>

        <article className="card ai-card">
          <div className="card-label">AI Proposal Draft</div>
          <h2>Natural language helper</h2>
          <p>
            Draft a spending request from plain language. For the submission, this stays offchain
            and only helps members prepare cleaner proposal text.
          </p>
          <textarea
            className="prompt-box"
            rows="4"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
          />
          <div className="inline-actions">
            <button className="primary-btn" onClick={handleGenerateDraft} type="button">
              Generate Draft
            </button>
            <button className="secondary-btn" onClick={handleUseDraft} type="button">
              Use Draft
            </button>
            <button className="secondary-btn" onClick={() => setDraft(initialDraft)} type="button">
              Clear
            </button>
          </div>
          <div className="draft-grid">
            <div>
              <span className="metric-label">Draft title</span>
              <strong>{draft.title || "Not generated yet"}</strong>
            </div>
            <div>
              <span className="metric-label">Draft amount</span>
              <strong>{draft.amount ? `${draft.amount} ${nativeSymbol}` : "TBD"}</strong>
            </div>
            <div className="draft-description">
              <span className="metric-label">Draft description</span>
              <p>{draft.description || "Use the generator to create a proposal summary."}</p>
            </div>
          </div>
        </article>
      </section>

      <section className="card composer-card">
        <div className="card-label">Proposal Composer</div>
        <h2>Submit a spend request</h2>
        <div className="field-grid">
          <label className="field">
            <span className="field-label">Recipient</span>
            <input
              className="field-input"
              value={proposalForm.recipient}
              onChange={(event) =>
                setProposalForm((current) => ({ ...current, recipient: event.target.value }))
              }
              placeholder="0x..."
            />
          </label>
          <label className="field">
            <span className="field-label">Amount</span>
            <input
              className="field-input"
              value={proposalForm.amount}
              onChange={(event) =>
                setProposalForm((current) => ({ ...current, amount: event.target.value }))
              }
              placeholder="0.50"
            />
          </label>
          <label className="field">
            <span className="field-label">Title</span>
            <input
              className="field-input"
              value={proposalForm.title}
              onChange={(event) =>
                setProposalForm((current) => ({ ...current, title: event.target.value }))
              }
              placeholder="Snacks budget"
            />
          </label>
          <label className="field field-span">
            <span className="field-label">Description</span>
            <textarea
              className="field-input field-textarea"
              rows="4"
              value={proposalForm.description}
              onChange={(event) =>
                setProposalForm((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="Why the team should spend this amount"
            />
          </label>
        </div>
        <div className="inline-actions">
          <button className="primary-btn" disabled={actionDisabled || vaultId == null} onClick={handleCreateProposal} type="button">
            Create Proposal
          </button>
          <button
            className="secondary-btn"
            onClick={() => setProposalForm(initialProposalForm)}
            type="button"
          >
            Clear Form
          </button>
        </div>
      </section>

      <section className="card proposal-card">
        <div className="card-label">Proposals</div>
        <div className="proposal-list">
          {proposals.length === 0 ? (
            <div className="empty-state">No proposals yet. Create the first spend request above.</div>
          ) : (
            proposals.map((proposal) => {
              const canCancel =
                canUseLiveActions &&
                addressesEqual(proposal.proposerAddress, walletAddress) &&
                proposal.status !== "Executed" &&
                proposal.status !== "Cancelled";

              return (
                <article className="proposal-item" key={proposal.id}>
                  <div>
                    <h3>{proposal.title}</h3>
                    <p>
                      {proposal.amount} to {proposal.recipient}
                    </p>
                    {proposal.description ? <p className="proposal-description">{proposal.description}</p> : null}
                    <span className="muted">
                      Proposed by {proposal.proposer} • {proposal.approvals}
                    </span>
                  </div>
                  <div className="proposal-side">
                    <span
                      className={`status-badge status-${proposal.status
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      {proposal.status}
                    </span>
                    <div className="inline-actions">
                      <button
                        className="secondary-btn"
                        disabled={
                          actionDisabled ||
                          proposal.status === "Executed" ||
                          proposal.status === "Cancelled"
                        }
                        onClick={() => handleApproveProposal(proposal.id)}
                        type="button"
                      >
                        Approve
                      </button>
                      <button
                        className="primary-btn"
                        disabled={actionDisabled || !proposal.canExecute}
                        onClick={() => handleExecuteProposal(proposal.id)}
                        type="button"
                      >
                        Execute
                      </button>
                      <button
                        className="secondary-btn"
                        disabled={!canCancel || isSubmitting}
                        onClick={() => handleCancelProposal(proposal.id)}
                        type="button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}

function createDemoVault(nativeSymbol) {
  return {
    name: "Hackathon Team Vault",
    balance: `123.50 ${nativeSymbol}`,
    memberCount: 3,
    threshold: "2 / 3 approvals",
    thresholdCount: 2
  };
}

function createDemoProposals(nativeSymbol) {
  return [
    {
      id: 2,
      title: "Demo video editor",
      description: "Pay a teammate who is cutting the submission video.",
      amount: `12 ${nativeSymbol}`,
      proposer: "0x4B9...c81",
      proposerAddress: "0x4B9f63C87E0a0a6Db11d54DA8B3c8Abc2d40Cc81",
      recipient: "0x8A3...1f2",
      recipientAddress: "0x8A3F63C87E0a0a6Db11d54DA8B3c8Abc2d40D1f2",
      approvals: "2 / 2",
      approvalCount: 2,
      status: "Ready to execute",
      canExecute: true
    },
    {
      id: 1,
      title: "Snacks budget",
      description: "Cover drinks and snacks during final demo prep.",
      amount: `30 ${nativeSymbol}`,
      proposer: "0x8A3...1f2",
      proposerAddress: "0x8A3F63C87E0a0a6Db11d54DA8B3c8Abc2d40D1f2",
      recipient: "0x7C1...4aa",
      recipientAddress: "0x7C1F63C87E0a0a6Db11d54DA8B3c8Abc2d40D4aa",
      approvals: "1 / 2",
      approvalCount: 1,
      status: "Pending",
      canExecute: false
    }
  ];
}

function createEmptyVault(nativeSymbol) {
  return {
    name: "No vault created yet",
    balance: `0 ${nativeSymbol}`,
    memberCount: 0,
    threshold: "-",
    thresholdCount: 0
  };
}

function parseVaultId(value) {
  if (!value) {
    return null;
  }

  try {
    const parsed = BigInt(value);
    return parsed > 0n ? parsed : null;
  } catch {
    return null;
  }
}

function parseMemberList(rawValue) {
  const values = rawValue
    .split(/[\n,]/)
    .map((value) => value.trim())
    .filter(Boolean);

  const seen = new Set();

  return values.filter((value) => {
    if (!isAddress(value)) {
      throw new Error(`Invalid member address: ${value}`);
    }

    const normalized = value.toLowerCase();
    if (seen.has(normalized)) {
      return false;
    }

    seen.add(normalized);
    return true;
  });
}

function humanizeError(error) {
  return (
    error?.shortMessage ||
    error?.details ||
    error?.message ||
    "Unknown error"
  );
}

function shortenAddress(address) {
  if (!address) {
    return "";
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function shortenHash(hash) {
  return `${hash.slice(0, 10)}...${hash.slice(-6)}`;
}

function addressesEqual(left, right) {
  return Boolean(left && right && left.toLowerCase() === right.toLowerCase());
}

export default App;
