require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 1337,
      // mining: {
      //   auto: false,
      //   interval: 5000
      // },
      accounts: {
        count: 20,
        mnemonic: "test test test test test test test test test test test junk"
      }
    }
  }
};