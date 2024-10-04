//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

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

    function notifyRewardAmount(IERC20 token, uint256 reward) external;
}

abstract contract FeesClaimerCore is Initializable, OwnableUpgradeable {
    address public collector;
    address public gelatoooooo;
    address public odos;
    address[] public tokens;
    IERC20[] public aTokens;
    IPool public pool;
    IPoolDataProvider public dataProvider;
    IWETH public wethOrTargetAsset;

    function __FeesClaimer_init(
        IPoolAddressesProvider _provider,
        address _collector,
        address _wethOrTargetAsset,
        address _odos,
        address[] memory _tokens,
        address _gelatoooooo,
        address _owner
    ) internal {
        __Ownable_init(msg.sender);

        collector = _collector;
        wethOrTargetAsset = IWETH(_wethOrTargetAsset);
        pool = IPool(_provider.getPool());
        gelatoooooo = _gelatoooooo;
        dataProvider = IPoolDataProvider(_provider.getPoolDataProvider());

        setTokens(_tokens);
        setOdos(_odos);

        _transferOwnership(_owner);
    }

    receive() external payable {
        wethOrTargetAsset.deposit{value: msg.value}();
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

    function setGelatoooooo(address _gelatoooooo) public onlyOwner {
        gelatoooooo = _gelatoooooo;
    }

    function setOdos(address _odos) public onlyOwner {
        odos = _odos;
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

    function _swapWithOdos(bytes memory data) internal {
        require(msg.sender == owner() || msg.sender == gelatoooooo, "who dis?");
        approve();
        (bool success, ) = odos.call(data);
        require(success, "odos call failed");
    }

    function refund(IERC20 token) public onlyOwner {
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }
}
