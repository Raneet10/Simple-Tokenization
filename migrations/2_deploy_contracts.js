var MyToken = artifacts.require("MyToken");
var MyTokenSale = artifacts.require("MyTokenSale");
var KycContract = artifacts.require("KycContract");

require("dotenv").config({path:"../.env"});
module.exports = async function(deployer) {
    let  accounts = await web3.eth.getAccounts();

    await deployer.deploy(MyToken, process.env.INITIAL_TOKENS);
    await deployer.deploy(KycContract);
    await deployer.deploy(MyTokenSale, 1, accounts[0], MyToken.address, KycContract.address);

    let contractInstance = await MyToken.deployed();
    await contractInstance.transfer(MyTokenSale.address, process.env.INITIAL_TOKENS);
}