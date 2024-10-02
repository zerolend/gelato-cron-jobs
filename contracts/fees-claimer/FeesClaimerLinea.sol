//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {FeesClaimerCore, IStaker} from "./FeesClaimerCore.sol";
import {IPoolAddressesProvider} from "@zerolendxyz/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";

contract FeesClaimerLinea is FeesClaimerCore {
    uint256 public treasuryPercentage;
    IStaker public zlpStaker;
    address public treasury;

    function initialize(
        IPoolAddressesProvider _provider,
        address _collector,
        address _wethOrTargetAsset,
        address _odos,
        address[] memory _tokens,
        address _gelatoooooo,
        address _owner
    ) public reinitializer(7) {
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

    function setPercentages(uint256 _treasuryPercentage) public onlyOwner {
        treasuryPercentage = _treasuryPercentage;
    }

    function setAddresses(
        address _treasury,
        address _zlpStaker
    ) public onlyOwner {
        treasury = _treasury;
        zlpStaker = IStaker(_zlpStaker);
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
        wethOrTargetAsset.approve(address(zlpStaker), remaining);
        zlpStaker.notifyRewardAmount(amt - treasuryAmt);
    }
}
