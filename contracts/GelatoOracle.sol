// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {AccessControlEnumerable} from "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";

/// @title A Gelato based oracle
contract GelatoOracle is AccessControlEnumerable {
    bytes32 public constant KEEPER_ROLE = keccak256("KEEPER_ROLE");
    int256 public latestAnswer;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function setAnswer(int256 _answer) external onlyRole(KEEPER_ROLE) {
        latestAnswer = _answer;
    }

    function decimals() external pure returns (uint8) {
        return 8;
    }
}
