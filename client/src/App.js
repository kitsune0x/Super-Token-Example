import React, { Component } from "react";
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import KycContract from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";
import "./App.css";

const Web3Utils = require('web3-utils');


class App extends Component {
  state = { loaded: false, kycAddress: "0x123", tokenSaleAddress: "" };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.getChainId();
      
      this.myToken = new this.web3.eth.Contract(
        MyToken.abi, MyToken.networks[this.networkId].address,
      );

      this.myTokenSale = new this.web3.eth.Contract(
        MyTokenSale.abi, MyTokenSale.networks[this.networkId].address,
      );

      this.kycContract = new this.web3.eth.Contract(
        KycContract.abi, KycContract.networks[this.networkId].address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.listenToTokenTransfer();
      this.setState({ loaded:true, tokenSaleAddress: this.myTokenSale._address }, this.updateUserTokens);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }


  handleKycSubmit = async () => {
    const {kycAddress} = this.state;
    console.log(this.kycContract.address);
    await this.kycContract.methods.setKycCompleted(kycAddress).send({from: this.accounts[0]});
    alert("Account "+kycAddress+" is now whitelisted");
  }

  updateUserTokens = async() => {
    let userTokens = await this.myToken.methods.balanceOf(this.accounts[0]).call();
    userTokens = Web3Utils.fromWei(userTokens, "ether");
    this.setState({userTokens: userTokens});
  }

  listenToTokenTransfer = async() => {
    this.myToken.events.Transfer({to: this.accounts[0]}).on("data", this.updateUserTokens);
  }

  handleBuyToken = async () => {
    await this.myTokenSale.methods.buyTokens(this.accounts[0]).send({from: this.accounts[0], value: Web3Utils.toWei("1", "ether").toString()});
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Buy SuperToken!</h1>
        <p>Purchase your tokens today!</p>

        <h2>First, whitelist your account. Whitelist spots are available:</h2>
        Provide your address: <input type="text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInputChange} />
        <button type="button" onClick={this.handleKycSubmit}>Add Address to Whitelist</button>

        <h2>Second, buy your tokens:</h2>
        <p>Send may send Ether to this address: {this.state.tokenSaleAddress}</p>
        <p>You currently have: {this.state.userTokens}</p>
        <button type="button" onClick={this.handleBuyToken}>Buy 1ETH Equivalent of SPT</button>
      </div>
    );
  }
}

export default App;
