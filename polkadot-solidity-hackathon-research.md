# Polkadot Solidity Hackathon 2026 - Complete Research

## Overview

The **first-ever Solidity hackathon on Polkadot** -- a 6-week online program to celebrate Solidity coming to Polkadot and accelerate the next generation of smart contract builders. Developers build production-ready dApps on **Polkadot Hub** using EVM Smart Contracts and PVM Smart Contracts, backed by shared security and seamless cross-chain capabilities.

- **Co-led by:** OpenGuild and Web3 Foundation (W3F)
- **Platform:** DoraHacks
- **Format:** 100% online (workshops, hacking, mentoring all virtual)
- **Region focus:** APAC, but open to ALL builders
- **Registrations:** 400+ as of early March 2026

---

## Timeline & Key Dates

| Date | Milestone |
|------|-----------|
| January 5, 2026 | Official promotion launch |
| January 5 - February 15 | Meetups & workshops across APAC |
| February 16, 2026 | Registration opens |
| **March 1, 2026** | **Hacking period begins** |
| **March 20, 2026** | **Project submission deadline** |
| **March 24-25, 2026** | **Demo Day (mandatory for prize eligibility)** |

---

## Prize Pool: $30,000 USD (+ ecosystem grant subsidies)

### Track 1: EVM Smart Contracts ($15,000)

| Place | Count | Prize |
|-------|-------|-------|
| 1st Prize | x2 | $3,000 each |
| 2nd Prize | x2 | $2,000 each |
| 3rd Prize | x2 | $1,000 each |
| Honorable Mentions | x6 | $500 each |

**Categories within EVM Track:**
- DeFi / Stablecoin-enabled dApps
- AI-powered dApps

### Track 2: PVM Smart Contracts ($15,000 presumed)

The PVM (PolkaVM) track is for projects that use Polkadot-native capabilities beyond standard EVM usage. If your project leverages PolkaVM's RISC-V execution engine for high-throughput, performance-intensive smart contracts, choose this track.

*Exact prize breakdown for PVM track not publicly detailed in available sources but presumed to mirror EVM track structure.*

### Additional Benefits for Winners
- Application curation support from OpenGuild for the **DeFi Builders Program**
- Marketing pipeline (social posts, AMAs, newsletters, user acquisition campaigns, meetup promotions) from Polkadot Officials, Polkadot APAC, OpenGuild, and ecosystem partners
- Dedicated founder-led marketing video campaign
- Prioritized **audit subsidy assessment** via Polkadot Assurance Legion

---

## Tracks in Detail

### Track 1: EVM Smart Contracts
- Build using **Solidity** and EVM-compatible smart contracts on Polkadot Hub
- Use familiar Ethereum tooling (Hardhat, Foundry, Remix, MetaMask)
- Categories: DeFi/Stablecoin dApps, AI-powered dApps

### Track 2: PVM Smart Contracts
- Uses **PolkaVM** (RISC-V native execution engine)
- For projects requiring maximum computational performance
- Deeper Polkadot-native integration beyond standard EVM
- Leverages Substrate power and deeper chain features

---

## Judging Criteria

Projects are evaluated on:
1. **Technical implementation** - quality of code and architecture
2. **Use of Polkadot Hub features** - leveraging native capabilities
3. **Innovation & impact** - novelty and potential real-world impact
4. **UX and adoption potential** - good UI/UX taken into account
5. **Team execution and presentation** - Demo Day performance matters

**Bonus points for:**
- Clear roadmap
- Innovative idea
- Proof of future commitment

---

## Rules & Requirements

### Eligibility
- Open to: developers (Web2/Web3), designers, product managers, students, startup founders
- **No prior Polkadot experience required**
- Team size: Not explicitly capped (prior Polkadot hackathons capped at 4 members; solo participation allowed)

### Disqualification Criteria
- Projects forking from established open-source repos with **>70% codebase similarity** to the original will be **immediately disqualified**
- All team members must **verify identity through Polkadot Official Discord**
- A **valid commit history** is required -- only code contributed during the hackathon will be scored
- Failure to meet entry requirements = disqualification regardless of quality

### Demo Day Rules
- **Mandatory attendance** with camera on to be eligible for prizes
- Must have a strong pitch deck
- Must present your project live

---

## Required Technologies

### Target Chain: Polkadot Hub (formerly Asset Hub)
- **NOT Moonbeam** -- this is native Polkadot Hub
- Polkadot Hub is EVM-**compatible** (not EVM-equivalent)
- Uses `pallet_revive` on PolkaVM under the hood
- ETH Proxy provides JSON-RPC server compatible with MetaMask and EVM wallets

### Critical Technical Details

**Compilation:**
- Must use **`resolc`** instead of standard `solc` to compile Solidity contracts
- Standard Solidity bytecode won't deploy directly
- Three recommended tooling options with resolc integration:
  1. **Polkadot Remix IDE**
  2. **@parity/hardhat-polkadot** (Hardhat plugin)
  3. **foundry-polkadot** (Foundry fork)

**Address System:**
- Ethereum H160 addresses (40-char hex) auto-convert to Polkadot AccountId32 by padding with `0xEE`
- Different from standard Substrate SS58 addresses but convertible

**Fee Model:**
- Gas denominated in **DOT** (not ETH)
- Three metered resources: `ref_time` (computation), `proof_size` (validator verification), `storage_deposit` (state bloat management)
- Lower fees than relay chain (~1/10th cost)
- Can pay fees in any asset, not just DOT

**Testnet:**
- **Westend Asset Hub Testnet** available for development

### Frontend
- React, Next.js, Vue, or similar frameworks recommended

---

## Sponsors & Partners

### Primary Organizers
- **OpenGuild**
- **Web3 Foundation (W3F)**

### Strategic Partners
- Bolt
- Papermoon
- Hyperbridge
- DoraHacks
- Bifrost
- Polkadot Event Bounty
- Magenta Labs
- ChaoticApp / Dotmemo
- OneBlock+
- Edgetributors
- BlockDevId

### Notable Judges
Representatives from:
- Bifrost
- Reactive DOT
- Papermoon
- Pendle Finance
- Dedot
- Velocity Labs
- Multiple other ecosystem organizations

*Note: No separate sponsor-specific bounties have been publicly announced -- the $30K pool is the main prize.*

---

## Submission Requirements

Submit via DoraHacks platform:
1. **GitHub repository** (must be open-source)
2. **Project description** (well-structured)
3. **Demo video** (1-3 minutes)
4. **Pitch deck** (optional but recommended)
5. **Valid commit history** showing contributions during hackathon period

---

## Starter Kits, Templates & Resources

### Development Tools
- **Scaffold-DOT** - Full-stack toolkit for Solidity development, testing, and deployment on Polkadot
- **create-dot-app** - Scaffolding tool with Solidity templates for React and Vue
- **hardhat-polkadot-example** - Demo for using Hardhat with Polkadot
- **DevContainer** - Pre-configured development environment
- **Foundry (foundry-polkadot)** - Forked Foundry for Polkadot compatibility
- **Hardhat (@parity/hardhat-polkadot)** - Hardhat plugin for Polkadot
- **Polkadot Remix IDE** - Browser-based IDE for rapid prototyping

### Client Libraries (for interacting with deployed contracts)
- Ethers.js
- Web3.js
- Web3.py
- Viem

### CodeCamp Workshops (5 sessions)
1. Introduction to Polkadot Solidity
2. Build on Polkadot: Narratives, Resources and Growth
3. EVM on Polkadot, Toolings and Development Setup (DevContainer, Foundry, Hardhat, Scaffold DOT)
4. Cross-chain DeFi Primitives (XCM and Hyperbridge SDK)
5. Polkadot Grant Ecosystem

### Coding Challenges from CodeCamp
- **Advanced:** Cross-chain smart contracts using XCM + Hyperbridge
- **Intermediate:** AI applications with Polkadot Agent Kit
- **Beginner:** Full-stack development using Scaffold DOT
- **Advanced:** Uniswap V2 DEX implementation on Polkadot

### Idea Exploration
- Project ideas board: https://build.openguild.wtf/explore-ideas?category=all

### Pitch Deck Template
- Available at: https://build.openguild.wtf/hackathon-resources/pitchdeck-template

---

## Support Channels

- OpenGuild Discord help channels
- Polkadot Hackathon Telegram
- Polkadot Developer Support Telegram
- Weekly office hours with mentors
- Direct mentor feedback
- Community AMAs
- Workshop recordings via https://luma.com/openguildcalendar

---

## Key Links

| Resource | URL |
|----------|-----|
| **Official Hackathon Site** | https://polkadothackathon.com/ |
| **DoraHacks Registration** | https://dorahacks.io/hackathon/polkadot-solidity-hackathon/detail |
| **DoraHacks Rules** | https://dorahacks.io/hackathon/polkadot-solidity-hackathon/rules |
| **Hackathon Resources** | https://build.openguild.wtf/hackathon-resources |
| **Explore Ideas** | https://build.openguild.wtf/explore-ideas?category=all |
| **CodeCamp** | https://codecamp.openguild.wtf/ |
| **Workshop Calendar** | https://luma.com/openguildcalendar |
| **OpenGuild Blog** | https://openguild.wtf/blog |
| **Polkadot Dev Docs** | https://docs.polkadot.com/ |
| **Smart Contracts Overview** | https://docs.polkadot.com/smart-contracts/overview/ |
| **Polkadot Hub Docs** | https://docs.polkadot.com/reference/polkadot-hub/ |
| **Hub Smart Contracts** | https://docs.polkadot.com/reference/polkadot-hub/smart-contracts/ |
| **Deploy with Ethers.js** | https://docs.polkadot.com/smart-contracts/libraries/ethers-js/ |
| **Deploy with Web3.js** | https://docs.polkadot.com/smart-contracts/libraries/web3-js/ |
| **Deploy with Remix** | https://docs.polkadot.com/smart-contracts/cookbook/smart-contracts/deploy-basic/basic-remix/ |
| **Deploy with Hardhat/Foundry** | https://docs.polkadot.com/develop/smart-contracts/dev-environments/foundry/ |
| **Polkadot Wiki** | https://wiki.polkadot.network/ |
| **Polkadot Hub Overview** | https://polkadot.com/platform/hub/ |
| **Hackathon Guide (GitHub)** | https://github.com/polkadot-developers/hackathon-guide |
| **Hub EVM Explainer** | https://openguild.wtf/blog/polkadot/polkadot-hub-is-another-evm-chain |
| **Scaffold-DOT Forum Post** | https://forum.polkadot.network/t/scaffold-dot-toolkit-for-solidity-development-testing-and-deployment/17197 |
| **OpenGuild on X** | https://x.com/openguildwtf |
| **Forum Announcement** | https://forum.polkadot.network/t/polkadot-solidity-openguilds-2026-campaigns-in-partnership-with-web3-foundation/16797 |
| **Eventbrite** | https://www.eventbrite.com/e/polkadot-solidity-hackathon-2026-tickets-1983155770294 |

---

## Critical Notes for Participants

1. **This is NOT a standard EVM chain.** You must compile with `resolc`, not `solc`. Use Polkadot-specific tooling (Polkadot Remix, @parity/hardhat-polkadot, or foundry-polkadot).
2. **Gas is in DOT**, not ETH.
3. **Demo Day is mandatory** -- camera on, pitch deck ready, or you cannot win.
4. **>70% fork similarity = instant disqualification.**
5. **All team members must verify identity** on Polkadot Official Discord.
6. **Only code written during the hackathon period counts** for scoring.
7. **Submission deadline is March 20** -- Demo Day is March 24-25.
8. Focus areas that align well: DeFi, stablecoin tools, AI agents, cross-chain apps (XCM/Hyperbridge).
