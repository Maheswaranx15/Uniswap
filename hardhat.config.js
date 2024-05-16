require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { DEPLOYER_PRIVATE_KEY, TEST_USER_PRIVATE_KEY,  ALCHEMY_API_KEY} = process.env;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  localhost: {
    url: "http://127.0.0.1:8545"
  },
  solidity: {
    compilers: [
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.4.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.5.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      }
    ],   
  },

  networks: {
    sepolia: {
      url: `https://atlantis-web3.blockxnet.com`,
      accounts: [DEPLOYER_PRIVATE_KEY]
    }
  }
};
