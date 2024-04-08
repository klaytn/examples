// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@klaytn/contracts/KIP/token/KIP7/KIP7.sol";
import "@klaytn/contracts/KIP/token/KIP7/extensions/KIP7Burnable.sol";
import "@klaytn/contracts/access/Ownable.sol";

contract MyToken is KIP7, KIP7Burnable, Ownable {
    constructor() KIP7("MyToken", "MTK") {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(KIP7, KIP7Burnable)
        returns (bool)
    {
        return
            super.supportsInterface(interfaceId);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
