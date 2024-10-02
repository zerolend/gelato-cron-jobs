//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {FeesClaimerCore, IStaker} from "./FeesClaimerCore.sol";
import {IPoolAddressesProvider} from "@zerolendxyz/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";

contract FeesClaimerBase is FeesClaimerCore {
    uint256 public treasuryPercentage;
    IStaker public staker;

    function init(
        IPoolAddressesProvider _provider,
        address _collector,
        address _weth,
        address _odos,
        address[] memory _tokens,
        address _gelatoooooo,
        address _owner,
        address _staker,
        uint256 _treasuryPercentage
    ) public reinitializer(7) {
        __FeesClaimer_init(
            _provider,
            _collector,
            _weth,
            _odos,
            _tokens,
            _gelatoooooo,
            _owner
        );

        staker = IStaker(_staker);
        treasuryPercentage = _treasuryPercentage;
    }

    function setPercentages(uint256 _treasuryPercentage) public onlyOwner {
        treasuryPercentage = _treasuryPercentage;
    }

    function execute(bytes memory data) public {
        _swapWithOdos(data);

        // send all weth to the destination
        uint256 amt = wethOrTargetAsset.balanceOf(address(this));

        // give % to the treasury
        uint256 treasuryAmt = (amt * treasuryPercentage) / 1e18;
        wethOrTargetAsset.transfer(owner(), treasuryAmt);

        // rest to zLP staking
        uint256 remaining = amt - treasuryAmt;
        wethOrTargetAsset.approve(address(staker), remaining);
        staker.notifyRewardAmount(amt - treasuryAmt);
    }
}
