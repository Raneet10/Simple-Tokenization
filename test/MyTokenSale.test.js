const MyTokenSale = artifacts.require("MyTokenSale");
const MyToken = artifacts.require("MyToken");

const chai = require("./chaisetup.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("My TokenSale test ", async accounts => {
    const [initialHolder, recepient, anotherAccount] = accounts;

    it("initial holder should not have tokens", async () => {
        let myTokenInstance = await MyToken.deployed();
        return expect(myTokenInstance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(new BN(0));
    });

   it("all tokens should be in MyTokensale", async () => {
        let myTokenInstance = await MyToken.deployed();
        let myTokenSaleInstance =await MyTokenSale.deployed();
        let totalSupply = await myTokenInstance.totalSupply();
        return expect(await myTokenInstance.balanceOf(myTokenSaleInstance.address).to.eventually.be.a.bignumber.equal(totalSupply));
    });

    it("should be possible to purchase tokens", async () => {
        let myTokenSaleInstance = await MyTokenSale.deployed();
        let myTokenInstance = await MyToken.deployed();
        let recepientBalanceBefore = await myTokenInstance.balanceOf(recepient);
        expect(myTokenSaleInstance.sendTransaction({from: recepient, value: web3.utils.toWei("1","wei")}).to.be.fulfilled);
    
        return expect((recepientBalanceBefore + 1).to.be.a.bignumber.equal(await myTokenInstance.balanceOf(recepient)));
    });
});



