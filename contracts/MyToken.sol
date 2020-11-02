//SPDX-License-Identifier: UNLICESNED
pragma solidity 0.6.8;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Nanhe Coffee", "NANC") public {
        _mint(msg.sender, initialSupply);
    }
}