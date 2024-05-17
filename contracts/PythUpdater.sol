//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {IPyth} from "@pythnetwork/pyth-sdk-solidity/IPyth.sol";

/**
 * @title A port of a chainlink aggregator powered by pyth network feeds
 * @author Deadshot Ryker
 * @notice This does not store any roundId information on-chain. Please review the code before using this implementation.
 */
contract PythUpdater {
    IPyth public pyth;

    constructor(address _pyth) {
        pyth = IPyth(_pyth);
    }

    function updateFeeds(bytes[] calldata priceUpdateData) public payable {
        // Update the prices to the latest available values and pay the required fee for it. The `priceUpdateData` data
        // should be retrieved from our off-chain Price Service API using the `pyth-evm-js` package.
        // See section "How Pyth Works on EVM Chains" below for more information.
        uint fee = pyth.getUpdateFee(priceUpdateData);
        pyth.updatePriceFeeds{value: fee}(priceUpdateData);
    }

    receive() external payable {
        // do nothing
    }
}
