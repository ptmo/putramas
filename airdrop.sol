// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Airdrop is Ownable {
    IERC20 public token;
    mapping(address => uint256) public airdropAmounts;
    mapping(address => bool) public isEligible;
    mapping(address => bool) public hasClaimed;
    event AirdropClaimed(address indexed recipient, uint256 amount);

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }

    function setAirdropAmounts(address[] calldata recipients, uint256[] calldata amounts) external onlyOwner {
        require(recipients.length == amounts.length, "Mismatched arrays");
        for (uint256 i = 0; i < recipients.length; i++) {
            airdropAmounts[recipients[i]] = amounts[i];
            isEligible[recipients[i]] = true; // Setiap penerima dianggap memenuhi syarat secara default
        }
    }

    function getAirdropAmount(address _address) external view returns (uint256) {
        return airdropAmounts[_address];
    }

    function claimAirdrop() external {
        require(isEligible[msg.sender], "Not eligible for airdrop");
        require(!hasClaimed[msg.sender], "Airdrop already claimed");
        uint256 amount = airdropAmounts[msg.sender];
        require(amount > 0, "No airdrop available");

        hasClaimed[msg.sender] = true;
        require(token.transfer(msg.sender, amount), "Transfer failed");
        emit AirdropClaimed(msg.sender, amount);
    }

    function deposit(uint256 amount) external onlyOwner {
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
    }

    function withdraw(uint256 amount) external onlyOwner {
        require(token.transfer(msg.sender, amount), "Transfer failed");
    }

    function setEligibility(address[] calldata addresses, bool[] calldata status) external onlyOwner {
        require(addresses.length == status.length, "Mismatched arrays");
        for (uint256 i = 0; i < addresses.length; i++) {
            isEligible[addresses[i]] = status[i];
        }
    }
}

