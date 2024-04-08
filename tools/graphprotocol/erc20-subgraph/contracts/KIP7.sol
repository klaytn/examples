// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@klaytn/contracts/KIP/token/KIP7/KIP7.sol";

contract MyToken is KIP7 {
    constructor() KIP7("MyToken", "MTK") {
        _mint(msg.sender, 10000 * 10 ** decimals());
    }
}