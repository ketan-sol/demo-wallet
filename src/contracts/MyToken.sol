// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MyToken is ERC20, ERC20Burnable, Ownable {
    //constructor function
    constructor() ERC20("MyToken", "MTK") {}

    //function to mint tokens
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    //function to burn tokens
    function burn(uint256 amount) public override onlyOwner {
        _burn(msg.sender, amount);
    }
}
