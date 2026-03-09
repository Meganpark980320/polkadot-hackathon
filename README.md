# polkadot-hackathon

ClubVault submission workspace for the Polkadot Solidity Hackathon.

## Repo layout

- `clubvault/`: smart contract, frontend, tests, and app scripts
- `docs/`: research, product specs, engineering notes, and submission docs
- `tasks.md`: hackathon execution checklist

## Start here

- App overview: [clubvault/README.md](./clubvault/README.md)
- Research and planning: [docs/research/polkadot-hackathon-ideas.md](./docs/research/polkadot-hackathon-ideas.md)
- Product spec: [docs/product/product-brief.md](./docs/product/product-brief.md)
- Submission script: [docs/submission/demo-script.md](./docs/submission/demo-script.md)
- Pitch deck outline: [docs/submission/pitch-deck.md](./docs/submission/pitch-deck.md)

## Local development

Use the locally installed Node binary:

```bash
PATH=/home/traverse/hackathon/.tools/node/bin:$PATH npm --prefix clubvault install
PATH=/home/traverse/hackathon/.tools/node/bin:$PATH npm --prefix clubvault run test
PATH=/home/traverse/hackathon/.tools/node/bin:$PATH npm --prefix clubvault run build
PATH=/home/traverse/hackathon/.tools/node/bin:$PATH npm --prefix clubvault run dev
```
