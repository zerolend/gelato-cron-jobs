//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {FeesClaimerCore, IStaker} from "./FeesClaimerCore.sol";
import {IPoolAddressesProvider} from "@zerolendxyz/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";

contract FeesClaimerMainnetBtc is FeesClaimerCore {
    address public treasury;

    function initialize(
        IPoolAddressesProvider _provider,
        address _collector,
        address _wethOrTargetAsset,
        address _odos,
        address[] memory _tokens,
        address _gelatoooooo,
        address _owner,
        address _treasury
    ) public reinitializer(1) {
        __FeesClaimer_init(_provider, _collector, _wethOrTargetAsset, _odos, _tokens, _gelatoooooo, _owner);
        treasury = _treasury;
    }

    function execute(bytes memory data) public {
        _swapWithOdos(data);

        // send all weth to the destination
        uint256 amt = wethOrTargetAsset.balanceOf(address(this));
        wethOrTargetAsset.transfer(treasury, amt);
    }
}
