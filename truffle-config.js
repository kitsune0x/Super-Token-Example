const path = require("path");
const HDWalletProvider = require('truffle-hdwallet-provider');
require('dotenv').config();

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1", port: 8545, network_id: "1337", chain_id: "1337"
    },
    ropsten: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, process.env.REMOTE_NODE),
      network_id: 3
    }
  },
  compilers: {    
    solc: {
      version: "^0.6.0"
    }
  }
};
