// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title ClubVault
/// @notice Lightweight shared treasury for small teams using native asset deposits.
contract ClubVault {
    enum ProposalStatus {
        Pending,
        Executed,
        Cancelled
    }

    struct Vault {
        string name;
        uint64 approvalThreshold;
        uint64 memberCount;
        uint256 balance;
        bool exists;
    }

    struct Proposal {
        uint256 vaultId;
        address proposer;
        address payable recipient;
        uint256 amount;
        string title;
        string description;
        uint64 approvalCount;
        ProposalStatus status;
        uint64 createdAt;
        uint64 executedAt;
    }

    uint256 public vaultCount;
    uint256 public proposalCount;

    mapping(uint256 => Vault) private vaults;
    mapping(uint256 => address[]) private vaultMembers;
    mapping(uint256 => mapping(address => bool)) public isVaultMember;

    mapping(uint256 => Proposal) private proposals;
    mapping(uint256 => uint256[]) private vaultProposalIds;
    mapping(uint256 => mapping(address => bool)) public hasApprovedProposal;

    event VaultCreated(
        uint256 indexed vaultId,
        string name,
        uint64 approvalThreshold,
        address[] members
    );
    event Deposited(uint256 indexed vaultId, address indexed from, uint256 amount);
    event ProposalCreated(
        uint256 indexed proposalId,
        uint256 indexed vaultId,
        address indexed proposer,
        address recipient,
        uint256 amount,
        string title
    );
    event ProposalApproved(
        uint256 indexed proposalId,
        uint256 indexed vaultId,
        address indexed approver,
        uint64 approvalCount
    );
    event ProposalExecuted(
        uint256 indexed proposalId,
        uint256 indexed vaultId,
        address indexed executor,
        address recipient,
        uint256 amount
    );
    event ProposalCancelled(
        uint256 indexed proposalId,
        uint256 indexed vaultId,
        address indexed cancelledBy
    );

    error VaultNotFound(uint256 vaultId);
    error ProposalNotFound(uint256 proposalId);
    error NotVaultMember(uint256 vaultId, address account);
    error InvalidMember(address member);
    error DuplicateMember(address member);
    error InvalidRecipient();
    error InvalidAmount();
    error AlreadyApproved(uint256 proposalId, address approver);
    error ProposalNotPending(uint256 proposalId);
    error NotProposer(uint256 proposalId, address account);
    error InsufficientApprovals(uint256 proposalId);
    error InsufficientVaultBalance(uint256 vaultId, uint256 requested, uint256 available);
    error TransferFailed();

    modifier onlyExistingVault(uint256 vaultId) {
        if (!vaults[vaultId].exists) revert VaultNotFound(vaultId);
        _;
    }

    modifier onlyVaultMember(uint256 vaultId) {
        if (!vaults[vaultId].exists) revert VaultNotFound(vaultId);
        if (!isVaultMember[vaultId][msg.sender]) {
            revert NotVaultMember(vaultId, msg.sender);
        }
        _;
    }

    modifier onlyExistingProposal(uint256 proposalId) {
        if (proposalId == 0 || proposalId > proposalCount) revert ProposalNotFound(proposalId);
        _;
    }

    function createVault(
        string calldata name,
        address[] calldata members
    ) external returns (uint256 vaultId) {
        vaultId = ++vaultCount;

        Vault storage vault = vaults[vaultId];
        vault.name = name;
        vault.exists = true;

        _addVaultMember(vaultId, msg.sender);

        uint256 length = members.length;
        for (uint256 i = 0; i < length; i++) {
            address member = members[i];
            if (member == msg.sender) {
                continue;
            }
            _addVaultMember(vaultId, member);
        }

        vault.approvalThreshold = _majorityThreshold(vault.memberCount);

        emit VaultCreated(vaultId, name, vault.approvalThreshold, vaultMembers[vaultId]);
    }

    function deposit(uint256 vaultId) external payable onlyVaultMember(vaultId) {
        if (msg.value == 0) revert InvalidAmount();

        vaults[vaultId].balance += msg.value;
        emit Deposited(vaultId, msg.sender, msg.value);
    }

    function createProposal(
        uint256 vaultId,
        address payable recipient,
        uint256 amount,
        string calldata title,
        string calldata description
    ) external onlyVaultMember(vaultId) returns (uint256 proposalId) {
        if (recipient == address(0)) revert InvalidRecipient();
        if (amount == 0) revert InvalidAmount();

        Vault storage vault = vaults[vaultId];
        if (vault.balance < amount) {
            revert InsufficientVaultBalance(vaultId, amount, vault.balance);
        }

        proposalId = ++proposalCount;

        Proposal storage proposal = proposals[proposalId];
        proposal.vaultId = vaultId;
        proposal.proposer = msg.sender;
        proposal.recipient = recipient;
        proposal.amount = amount;
        proposal.title = title;
        proposal.description = description;
        proposal.status = ProposalStatus.Pending;
        proposal.createdAt = uint64(block.timestamp);

        vaultProposalIds[vaultId].push(proposalId);

        emit ProposalCreated(
            proposalId,
            vaultId,
            msg.sender,
            recipient,
            amount,
            title
        );
    }

    function approveProposal(
        uint256 proposalId
    ) external onlyExistingProposal(proposalId) {
        Proposal storage proposal = proposals[proposalId];
        uint256 vaultId = proposal.vaultId;

        if (!isVaultMember[vaultId][msg.sender]) {
            revert NotVaultMember(vaultId, msg.sender);
        }
        if (proposal.status != ProposalStatus.Pending) {
            revert ProposalNotPending(proposalId);
        }
        if (hasApprovedProposal[proposalId][msg.sender]) {
            revert AlreadyApproved(proposalId, msg.sender);
        }

        hasApprovedProposal[proposalId][msg.sender] = true;
        proposal.approvalCount += 1;

        emit ProposalApproved(proposalId, vaultId, msg.sender, proposal.approvalCount);
    }

    function executeProposal(
        uint256 proposalId
    ) external onlyExistingProposal(proposalId) {
        Proposal storage proposal = proposals[proposalId];
        uint256 vaultId = proposal.vaultId;
        Vault storage vault = vaults[vaultId];

        if (!isVaultMember[vaultId][msg.sender]) {
            revert NotVaultMember(vaultId, msg.sender);
        }
        if (proposal.status != ProposalStatus.Pending) {
            revert ProposalNotPending(proposalId);
        }
        if (proposal.approvalCount < vault.approvalThreshold) {
            revert InsufficientApprovals(proposalId);
        }
        if (vault.balance < proposal.amount) {
            revert InsufficientVaultBalance(vaultId, proposal.amount, vault.balance);
        }

        vault.balance -= proposal.amount;
        proposal.status = ProposalStatus.Executed;
        proposal.executedAt = uint64(block.timestamp);

        (bool ok, ) = proposal.recipient.call{value: proposal.amount}("");
        if (!ok) revert TransferFailed();

        emit ProposalExecuted(
            proposalId,
            vaultId,
            msg.sender,
            proposal.recipient,
            proposal.amount
        );
    }

    function cancelProposal(
        uint256 proposalId
    ) external onlyExistingProposal(proposalId) {
        Proposal storage proposal = proposals[proposalId];

        if (proposal.proposer != msg.sender) {
            revert NotProposer(proposalId, msg.sender);
        }
        if (proposal.status != ProposalStatus.Pending) {
            revert ProposalNotPending(proposalId);
        }

        proposal.status = ProposalStatus.Cancelled;
        emit ProposalCancelled(proposalId, proposal.vaultId, msg.sender);
    }

    function getVault(
        uint256 vaultId
    )
        external
        view
        onlyExistingVault(vaultId)
        returns (
            string memory name,
            uint64 approvalThreshold,
            uint64 memberCount,
            uint256 balance
        )
    {
        Vault storage vault = vaults[vaultId];
        return (vault.name, vault.approvalThreshold, vault.memberCount, vault.balance);
    }

    function getVaultMembers(
        uint256 vaultId
    ) external view onlyExistingVault(vaultId) returns (address[] memory members) {
        return vaultMembers[vaultId];
    }

    function getProposal(
        uint256 proposalId
    )
        external
        view
        onlyExistingProposal(proposalId)
        returns (
            uint256 vaultId,
            address proposer,
            address recipient,
            uint256 amount,
            string memory title,
            string memory description,
            uint64 approvalCount,
            ProposalStatus status,
            uint64 createdAt,
            uint64 executedAt
        )
    {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.vaultId,
            proposal.proposer,
            proposal.recipient,
            proposal.amount,
            proposal.title,
            proposal.description,
            proposal.approvalCount,
            proposal.status,
            proposal.createdAt,
            proposal.executedAt
        );
    }

    function getVaultProposalIds(
        uint256 vaultId
    ) external view onlyExistingVault(vaultId) returns (uint256[] memory ids) {
        return vaultProposalIds[vaultId];
    }

    function _addVaultMember(uint256 vaultId, address member) internal {
        if (member == address(0)) revert InvalidMember(member);
        if (isVaultMember[vaultId][member]) revert DuplicateMember(member);

        isVaultMember[vaultId][member] = true;
        vaultMembers[vaultId].push(member);
        vaults[vaultId].memberCount += 1;
    }

    function _majorityThreshold(uint64 memberCount) internal pure returns (uint64) {
        return (memberCount / 2) + 1;
    }
}
