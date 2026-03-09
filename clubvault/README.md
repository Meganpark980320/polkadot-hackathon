# ClubVault

Hackathon build target for `Polkadot Solidity Hackathon 2026`.

## Goal

Build a lightweight shared treasury for student teams.

Core flow:

1. Create a vault
2. Add members
3. Deposit native asset
4. Create spending proposal
5. Approve proposal
6. Execute proposal after majority approval

## Current status

- Product brief locked
- MVP spec locked
- Solidity contract implemented
- Hardhat compile/test passing
- Vite frontend build passing
- Frontend live read/write flow implemented
- AI-assisted proposal draft flow implemented
- Polkadot Hub TestNet deployment completed

## Deployed contract

- Network: `Polkadot Hub TestNet`
- RPC: `https://services.polkadothub-rpc.com/testnet`
- Contract: `0x3Dc5041c113844030162005a6827ad06308d2c66`
- Explorer: `https://blockscout-passet-hub.parity-testnet.parity.io/address/0x3Dc5041c113844030162005a6827ad06308d2c66`
- Demo vault: `Vault #1`

## Repo structure

- `contracts/ClubVault.sol`: single-contract MVP implementation
- `scripts/deploy.js`: deployment script
- `scripts/seedDemo.js`: demo state bootstrap script
- `test/ClubVault.js`: Hardhat test suite
- `src/`: React frontend
- `src/lib/clubvaultClient.js`: viem-based wallet and contract client

## Architecture

See [../clubvault-architecture.md](../clubvault-architecture.md) for the Mermaid diagram and the component-level overview.

## Freeze Status

See [../clubvault-feature-freeze.md](../clubvault-feature-freeze.md) for the locked submission scope and the allowed changes after feature freeze.

## MVP rules

- Proposals can be created by any member
- Approval threshold is simple majority
- Proposal creator can approve
- Execution is manual but available immediately after threshold is reached
- Native asset only for MVP

## Frontend flow

1. Connect wallet
2. Create vault
3. Deposit native asset
4. Draft proposal text with the local AI helper
5. Submit proposal
6. Approve proposal
7. Execute proposal after majority approval

## Environment

- `VITE_CLUBVAULT_ADDRESS`: deployed contract address
- `VITE_RPC_URL`: optional RPC endpoint for reads and receipt polling
- `VITE_CLUBVAULT_VAULT_ID`: optional default vault id
- `VITE_NATIVE_SYMBOL`: optional native symbol label, defaults to `DOT`
- `VITE_EXPLORER_TX_BASE_URL`: optional transaction explorer prefix for last-tx links
- `VITE_POLKADOT_HUB_CHAIN_ID`: expected chain id for network guard, defaults to `420420417`
- `VITE_POLKADOT_HUB_NETWORK_LABEL`: expected network label, defaults to `Polkadot Hub TestNet`

See `.env.example` for the expected keys.

## Next build steps

1. Migrate the toolchain to the Polkadot-specific `@parity/hardhat-polkadot` path if submission rules require resolc artifacts
2. Add event-driven refresh instead of manual reload
3. Tighten proposal validation and empty-state polish
4. Submit through the hackathon portal

## Local commands

Use the locally installed Node binary:

```bash
PATH=/home/traverse/hackathon/.tools/node/bin:$PATH npm install
PATH=/home/traverse/hackathon/.tools/node/bin:$PATH npm run compile
PATH=/home/traverse/hackathon/.tools/node/bin:$PATH npm run test
PATH=/home/traverse/hackathon/.tools/node/bin:$PATH npm run build
PATH=/home/traverse/hackathon/.tools/node/bin:$PATH npm run dev
PATH=/home/traverse/hackathon/.tools/node/bin:$PATH npm run deploy
PATH=/home/traverse/hackathon/.tools/node/bin:$PATH npm run seed
```
