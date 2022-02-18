var MyToken = artifacts.require("./MyToken.sol");
var MyTokenSales = artifacts.require("./MyTokenSale.sol");
var KycContract = artifacts.require("./KycContract.sol");
var BN = web3.utils.BN;
require('dotenv').config({path: '../.env'});

module.exports = async function(deployer) {
  let addr = await web3.eth.getAccounts();
  await deployer.deploy(MyToken, new BN("1000000000000000000000000"));
  await deployer.deploy(KycContract);
  await deployer.deploy(MyTokenSales, 3030, addr[0], MyToken.address, KycContract.address);
  let tokenInstance = await MyToken.deployed();
  await tokenInstance.transfer(MyTokenSales.address, new BN("1000000000000000000000000"));
};