//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {IPool} from "./IPool.sol";

contract FeesClaimer is Ownable {
    address public collector;
    address public destination;
    IPool public pool;
    address[] public tokens;
    IERC20[] public aTokens;

    constructor(
        address _collector,
        address _destination,
        IPool _pool,
        address[] memory _tokens,
        IERC20[] memory _aTokens
    ) {
        collector = _collector;
        destination = _destination;
        pool = _pool;
        tokens = _tokens;
        aTokens = _aTokens;
    }

    function setTokens(
        address[] memory _tokens,
        IERC20[] memory _aTokens
    ) external onlyOwner {
        tokens = _tokens;
        aTokens = _aTokens;
    }

    function setDestination(address _destination) external onlyOwner {
        destination = _destination;
    }

    function execute() public {
        pool.mintToTreasury(tokens);

        for (uint i = 0; i < tokens.length; i++) {
            IERC20 aToken = aTokens[i];
            uint256 bal = aToken.balanceOf(collector);

            if (bal > 0) {
                aToken.transferFrom(collector, address(this), bal);
                pool.withdraw(tokens[i], bal, destination);
            }
        }
    }
}
