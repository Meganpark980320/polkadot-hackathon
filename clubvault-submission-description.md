# ClubVault Submission Description

## One-line summary

ClubVault is a lightweight shared treasury for student teams and hackathon teams, with proposal-based spending and majority approval.

## Problem

Small teams still manage shared money with chats, screenshots, spreadsheets, and personal bank transfers. That makes it hard to track who funded the treasury, who approved spending, and whether a payout was actually authorized.

## Solution

ClubVault gives a team a simple onchain vault:

- create a vault with team members
- deposit native assets into the treasury
- create spending proposals
- approve proposals with a simple majority rule
- execute payouts transparently after approval

## Why Polkadot Hub

We wanted a Solidity-first workflow with a clear path into the Polkadot ecosystem. Polkadot Hub EVM lets us keep the developer experience familiar while targeting a chain that is explicitly designed for smart-contract use cases inside the Polkadot stack.

## What we built

- single-contract multi-vault architecture
- deposit, proposal, approval, execution, and cancellation flow
- React + Vite frontend with live read/write actions
- wallet connection and network warning for Polkadot Hub TestNet
- local AI draft helper that turns plain language into a proposal draft without changing the onchain rules

## Demo flow

1. Connect wallet
2. Create a team vault
3. Deposit funds
4. Draft a proposal with the AI helper
5. Submit the proposal
6. Approve it with team members
7. Execute the payout

## Stack

- Solidity
- Hardhat
- React + Vite
- viem
- MetaMask / EIP-1193 wallet flow
