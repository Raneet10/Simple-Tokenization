const MyToken = artifacts.require("MyToken");

const chai = require("./chaisetup.js");
const BN = web3.utils.BN;
const expect = chai.expect;

require("dotenv").config({path: "../.env"});
contract("MyToken Test", async accounts =>{
    const [initialHolder, recipient, anotherAccount] = accounts;

    beforeEach(async () => {
        this.myTokenInstance = await MyToken.new(process.env.INITIAL_TOKENS);
    });

    it("all tokens should be in initialHolder's account", async () => {
        let contractInstance = this.myTokenInstance;
        let totalSupply = await contractInstance.totalSupply();
        return expect(contractInstance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
    });

    it("is possible to transfer tokens from one account to another",async () =>{
            let contractInstance =this.myTokenInstance;
            let tokensToSend = 1;
            let balanceOfSender = await contractInstance.balanceOf(initialHolder);
            let balanceOfRecipient = await contractInstance.balanceOf(recipient);

            expect(contractInstance.transfer(recipient, tokensToSend)).to.eventually.be.fulfilled;
            //checking balances of sender and recepient

            expect(contractInstance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(balanceOfSender.sub(new BN(tokensToSend)));
            return expect(contractInstance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(balanceOfRecipient.add(new BN(tokensToSend)));
     });

    it("should not allow transfer of more tokens than balance of an account", async () => {
        let contractInstance = this.myTokenInstance;
        let balanceOfSender = await contractInstance.balanceOf(initialHolder);
        let balanceOfRecipient = await contractInstance.balanceOf(recipient);
        expect(contractInstance.transfer(recipient, new BN(balanceOfSender+1))).to.eventually.be.rejected;

        //checking whether balance of both sender and recepient are same
        expect(contractInstance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(balanceOfSender);
        return expect(contractInstance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(balanceOfRecipient);

    });

    it("should not allow transfer of non-positive tokens", async () => {
            let contractInstance = this.myTokenInstance;
            let balanceOfSender = await contractInstance.balanceOf(initialHolder);
            let balanceOfRecipient = await contractInstance.balanceOf(recipient);
            
            expect(contractInstance.transfer(recipient,-1)).to.eventually.be.rejected;

            //checking whether balance of both sender and recepient are same
            expect(contractInstance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(balanceOfSender);
            return expect(contractInstance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(balanceOfRecipient);
    });
});