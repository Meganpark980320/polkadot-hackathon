import { readFileSync } from "node:fs";
import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { defineConfig } from "hardhat/config";

function loadLocalSecrets() {
  try {
    const raw = readFileSync("../.secrets.env", "utf8");

    return Object.fromEntries(
      raw
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .filter((line) => !line.startsWith("#"))
        .map((line) => {
          const index = line.indexOf("=");
          return [line.slice(0, index), line.slice(index + 1)];
        })
    );
  } catch {
    return {};
  }
}

const secrets = loadLocalSecrets();

export default defineConfig({
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      type: "edr-simulated",
      chainType: "l1"
    },
    polkadotHubTestnet: {
      type: "http",
      chainType: "l1",
      url: "https://services.polkadothub-rpc.com/testnet",
      accounts: secrets.PRIVATE_KEY ? [secrets.PRIVATE_KEY] : []
    }
  }
});
