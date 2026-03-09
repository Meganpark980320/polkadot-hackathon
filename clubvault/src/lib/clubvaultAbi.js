export const clubVaultAbi = [
  {
    type: "function",
    name: "vaultCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "getVault",
    stateMutability: "view",
    inputs: [{ name: "vaultId", type: "uint256" }],
    outputs: [
      { name: "name", type: "string" },
      { name: "approvalThreshold", type: "uint64" },
      { name: "memberCount", type: "uint64" },
      { name: "balance", type: "uint256" }
    ]
  },
  {
    type: "function",
    name: "getVaultProposalIds",
    stateMutability: "view",
    inputs: [{ name: "vaultId", type: "uint256" }],
    outputs: [{ name: "ids", type: "uint256[]" }]
  },
  {
    type: "function",
    name: "getVaultMembers",
    stateMutability: "view",
    inputs: [{ name: "vaultId", type: "uint256" }],
    outputs: [{ name: "members", type: "address[]" }]
  },
  {
    type: "function",
    name: "getProposal",
    stateMutability: "view",
    inputs: [{ name: "proposalId", type: "uint256" }],
    outputs: [
      { name: "vaultId", type: "uint256" },
      { name: "proposer", type: "address" },
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "title", type: "string" },
      { name: "description", type: "string" },
      { name: "approvalCount", type: "uint64" },
      { name: "status", type: "uint8" },
      { name: "createdAt", type: "uint64" },
      { name: "executedAt", type: "uint64" }
    ]
  },
  {
    type: "function",
    name: "createVault",
    stateMutability: "nonpayable",
    inputs: [
      { name: "name", type: "string" },
      { name: "members", type: "address[]" }
    ],
    outputs: [{ name: "vaultId", type: "uint256" }]
  },
  {
    type: "function",
    name: "deposit",
    stateMutability: "payable",
    inputs: [{ name: "vaultId", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "createProposal",
    stateMutability: "nonpayable",
    inputs: [
      { name: "vaultId", type: "uint256" },
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "title", type: "string" },
      { name: "description", type: "string" }
    ],
    outputs: [{ name: "proposalId", type: "uint256" }]
  },
  {
    type: "function",
    name: "approveProposal",
    stateMutability: "nonpayable",
    inputs: [{ name: "proposalId", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "executeProposal",
    stateMutability: "nonpayable",
    inputs: [{ name: "proposalId", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "cancelProposal",
    stateMutability: "nonpayable",
    inputs: [{ name: "proposalId", type: "uint256" }],
    outputs: []
  }
];
