//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {FeesClaimerCore, IStaker} from "./FeesClaimerCore.sol";
import {IPoolAddressesProvider} from "@zerolendxyz/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";

contract FeesClaimerBase is FeesClaimerCore {
    uint256 public treasuryPercentage;
    uint256 public zaiPercentage;

    address public treasury;
    IStaker public zaiStaker;
    IStaker public zlpStaker;

    function initialize(
        IPoolAddressesProvider _provider,
        address _collector,
        address _wethOrTargetAsset,
        address _odos,
        address[] memory _tokens,
        address _gelatoooooo,
        address _owner
    ) public reinitializer(2) {
        __FeesClaimer_init(
            _provider,
            _collector,
            _wethOrTargetAsset,
            _odos,
            _tokens,
            _gelatoooooo,
            _owner
        );
    }

    function setPercentages(
        uint256 _treasuryPercentage,
        uint256 _zaiPercentage
    ) public onlyOwner {
        treasuryPercentage = _treasuryPercentage;
        zaiPercentage = _zaiPercentage;
    }

    function setAddresses(
        address _treasury,
        address _zaiStaker,
        address _zlpStaker
    ) public onlyOwner {
        treasury = _treasury;
        zaiStaker = IStaker(_zaiStaker);
        zlpStaker = IStaker(_zlpStaker);
    }

    function execute(bytes memory data) public {
        _swapWithOdos(data);

        // send all weth to the destination
        uint256 amt = wethOrTargetAsset.balanceOf(address(this));

        // give % to the treasury
        uint256 treasuryAmt = (amt * treasuryPercentage) / 1e18;
        if (treasuryAmt > 0) wethOrTargetAsset.transfer(treasury, treasuryAmt);

        // give % to the USDz/USDC stakers
        uint256 zaiAmount = (amt * zaiPercentage) / 1e18;
        if (zaiAmount > 0) {
            wethOrTargetAsset.approve(address(zaiStaker), zaiAmount);
            zaiStaker.notifyRewardAmount(wethOrTargetAsset, zaiAmount);
        }

        // rest to zLP staking
        uint256 remaining = amt - treasuryAmt - zaiAmount;
        if (remaining > 0) {
            wethOrTargetAsset.approve(address(zlpStaker), remaining);
            zlpStaker.notifyRewardAmount(remaining);
        }
    }
}
