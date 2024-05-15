//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {IPoolDataProvider} from "@zerolendxyz/core-v3/contracts/interfaces/IPoolDataProvider.sol";
import {IPoolAddressesProvider} from "@zerolendxyz/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IPool} from "@zerolendxyz/core-v3/contracts/interfaces/IPool.sol";

contract FeesClaimer is Ownable {
    address public collector;
    address public destination;
    IPool public pool;
    IPoolDataProvider public dataProvider;
    address[] public tokens;
    IERC20[] public aTokens;

    constructor(
        IPoolAddressesProvider _provider,
        address _collector,
        address _destination,
        address[] memory _tokens
    ) {
        collector = _collector;
        destination = _destination;
        pool = IPool(_provider.getPool());
        dataProvider = IPoolDataProvider(_provider.getPoolDataProvider());

        setTokens(_tokens);
    }

    function setTokens(address[] memory _tokens) public onlyOwner {
        tokens = _tokens;

        IERC20[] memory _aTokens = new IERC20[](_tokens.length);

        for (uint i = 0; i < _tokens.length; i++) {
            (address aTokenAddress, , ) = dataProvider
                .getReserveTokensAddresses(_tokens[i]);
            _aTokens[i] = IERC20(aTokenAddress);
        }

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
