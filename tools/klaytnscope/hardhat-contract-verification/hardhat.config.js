require("@nomicfoundation/hardhat-toolbox");

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

// 1. Mainnet Cypress configuration details https://docs.klaytnscope.com/contract/configuration-for-hardhat-verify-plugin
// 2. RPC details can be found https://docs.klaytn.foundation/docs/references/service-providers/public-en/

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    klaytn: {
      chainId: 1001,
      url: "https://public-en-baobab.klaytn.net",
      accounts:[PRIVATE_KEY]
    },
  },
  etherscan: {
    apiKey: {
      klaytn: "unnecessary",
    },
    customChains: [
      {
        network: "klaytn",
        chainId: 1001,
        urls: {
          apiURL: "https://api-baobab.klaytnscope.com/api",
          browserURL: "https://baobab.klaytnscope.com",
        },
      },
    ]
  },
  sourcify: {
    enabled: false
  }
}