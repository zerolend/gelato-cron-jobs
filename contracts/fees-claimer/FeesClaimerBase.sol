//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {FeesClaimerCore, IStaker} from "./FeesClaimerCore.sol";
import {IPoolAddressesProvider} from "@zerolendxyz/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";

contract FeesClaimerBase is FeesClaimerCore {
    uint256 public treasuryPercentage;
    uint256 public zaiPercentage;
    IStaker public zaiStaker;
    IStaker public zlpStaker;

    function init(
        IPoolAddressesProvider _provider,
        address _collector,
        address _weth,
        address _odos,
        address[] memory _tokens,
        address _gelatoooooo,
        address _owner,
        address _zaiStaker,
        address _zlpStaker,
        uint256 _treasuryPercentage,
        uint256 _zaiPercentage
    ) public reinitializer(1) {
        __FeesClaimer_init(
            _provider,
            _collector,
            _weth,
            _odos,
            _tokens,
            _gelatoooooo,
            _owner
        );

        treasuryPercentage = _treasuryPercentage;
        zaiPercentage = _zaiPercentage;
        zaiStaker = IStaker(_zaiStaker);
        zlpStaker = IStaker(_zlpStaker);
    }

    function setPercentages(
        uint256 _treasuryPercentage,
        uint256 _zaiPercentage
    ) public onlyOwner {
        treasuryPercentage = _treasuryPercentage;
        zaiPercentage = _zaiPercentage;
    }

    function execute(bytes memory data) public {
        _swapWithOdos(data);

        // send all weth to the destination
        uint256 amt = wethOrTargetAsset.balanceOf(address(this));

        // give % to the treasury
        uint256 treasuryAmt = (amt * treasuryPercentage) / 1e18;
        wethOrTargetAsset.transfer(owner(), treasuryAmt);

        // give % to the USDz/USDC stakers
        uint256 zaiAmount = (amt * zaiPercentage) / 1e18;
        wethOrTargetAsset.transfer(owner(), treasuryAmt);
        zaiStaker.notifyRewardAmount(wethOrTargetAsset, zaiAmount);

        // rest to zLP staking
        uint256 remaining = amt - treasuryAmt - zaiAmount;
        wethOrTargetAsset.approve(address(zaiStaker), remaining);
        zlpStaker.notifyRewardAmount(remaining);
    }
}
