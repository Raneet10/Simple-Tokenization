import React, { Component } from "react";
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import KycContract from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";


class App extends Component {
  state = {loaded: false, kycAddress: "0x1234", tokenSaleAddress: "", userTokens: 0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      
      this.myTokenInstance =  new this.web3.eth.Contract(
       MyToken.abi,
      MyToken.networks[this.networkId] && MyToken.networks[this.networkId].address,
      );

      this.kycContractInstance =  new this.web3.eth.Contract(
        KycContract.abi,
         KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address,
       );

       this.myTokenSaleInstance =  new this.web3.eth.Contract(
        MyTokenSale.abi,
         MyTokenSale.networks[this.networkId] && MyTokenSale.networks[this.networkId].address,
       );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.listenToTokenPurchase();
      this.setState({loaded: true, tokenSaleAddress: this.myTokenSaleInstance.options.address }, this.getUserTokens);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleInput = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value; 
    const name = target.name;
    this.setState(
      {
        [name]: value
      }
    );
  }

  handleSubmit = async () => {
    const {kycAddress} = this.state;
    await this.kycContractInstance.methods.completeKyc(kycAddress).send({from: this.accounts[0]});
    alert("Congrats! KYC completed");
  }

  getUserTokens = async () => {
    let userTokens = await this.myTokenInstance.methods.balanceOf(this.accounts[0]).call();
    this.setState({userTokens: userTokens});

  }

  listenToTokenPurchase =  async () => {
    await this.myTokenInstance.events.Transfer({to: this.accounts[0]}).on("data", this.getUserTokens);
  }

  buyOneToken = async () => {
    //Directly sending wei to myTokenSale instead of calling buyToken() method
    await this.myTokenSaleInstance.methods.buyTokens(this.accounts[0]).send({from: this.accounts[0], value: "1"});
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Get your nanhe coffee tokens today!</h1>
        <h2>Enable your account</h2>
        Address to allow: 
        <input type="text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInput}/>
       <p>Send ether to this address: <b>{this.state.tokenSaleAddress}</b></p>
       <button type="button" onClick={this.handleSubmit}>Add Address to whitelist </button>

       <p>You have : <b>{this.state.userTokens}</b> NAN tokens</p>
       <button type="button" onClick = {this.buyOneToken}>Purchase more token</button>
      </div>
    );
  }
}

export default App;
