//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {IPoolDataProvider} from "@zerolendxyz/core-v3/contracts/interfaces/IPoolDataProvider.sol";
import {IPoolAddressesProvider} from "@zerolendxyz/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IPool} from "@zerolendxyz/core-v3/contracts/interfaces/IPool.sol";

interface IWETH is IERC20 {
    function withdraw(uint amount) external;

    function deposit() external payable;
}

interface IStaker {
    function notifyRewardAmount(uint256 amount) external;
}

contract FeesClaimSwap is Initializable, OwnableUpgradeable {
    address public collector;
    address public gelatoooooo;
    address public odos;
    address[] public tokens;
    IERC20[] public aTokens;
    IPool public pool;
    IPoolDataProvider public dataProvider;
    IStaker public staker;
    IWETH public weth;

    function init(
        IPoolAddressesProvider _provider,
        address _collector,
        address _weth,
        address _odos,
        address[] memory _tokens,
        address _gelatoooooo,
        address _staker,
        address _owner
    ) public reinitializer(6) {
        __Ownable_init(msg.sender);

        collector = _collector;
        weth = IWETH(_weth);
        pool = IPool(_provider.getPool());
        gelatoooooo = _gelatoooooo;
        dataProvider = IPoolDataProvider(_provider.getPoolDataProvider());
        staker = IStaker(_staker);

        setTokens(_tokens);
        setOdos(_odos);

        _transferOwnership(_owner);
    }

    receive() external payable {
        weth.deposit{value: msg.value}();
    }

    function setOdos(address _odos) public onlyOwner {
        odos = _odos;
    }

    function balances()
        public
        view
        returns (uint256[] memory, address[] memory)
    {
        uint256[] memory amounts = new uint256[](tokens.length);

        for (uint i = 0; i < tokens.length; i++) {
            amounts[i] = IERC20(tokens[i]).balanceOf(address(this));
        }

        return (amounts, tokens);
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

    function approve() public {
        for (uint i = 0; i < tokens.length; i++) {
            IERC20(tokens[i]).approve(odos, type(uint256).max);
        }
    }

    function collect() public returns (uint256[] memory) {
        pool.mintToTreasury(tokens);

        uint256[] memory amounts = new uint256[](tokens.length);
        for (uint i = 0; i < tokens.length; i++) {
            IERC20 aToken = aTokens[i];
            uint256 bal = aToken.balanceOf(collector);

            if (bal > 0) {
                aToken.transferFrom(collector, address(this), bal);
                pool.withdraw(tokens[i], bal, address(this));
                amounts[i] = IERC20(tokens[i]).balanceOf(address(this));
            }
        }

        return amounts;
    }

    function swap(bytes memory data) public {
        require(msg.sender == owner() || msg.sender == gelatoooooo, "who dis?");
        approve();
        (bool success, ) = odos.call(data);
        require(success, "odos call failed");

        // send all weth to the destination
        uint256 amt = weth.balanceOf(address(this));

        // give 50% to the owner
        weth.transfer(owner(), amt / 2);

        // 50% to zLP staking
        weth.approve(address(staker), amt / 2);
        staker.notifyRewardAmount(amt / 2);
    }

    function refund(IERC20 token) public onlyOwner {
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }
}
