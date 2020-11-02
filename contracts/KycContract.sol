//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.6.8;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
contract KycContract is Ownable {
    mapping(address => bool) private allowedToPurchase;

    function isAllowed(address _beneficiary) public view returns(bool) {
        return allowedToPurchase[_beneficiary];
    }

    function completeKyc(address _beneficiary) public onlyOwner{
        allowedToPurchase[_beneficiary] = true;
    }

    function revokeKyc(address _beneficiary) public onlyOwner{
        allowedToPurchase[_beneficiary] = false;
    }
}
