// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
 interface IKlaySwapRouterV2  {
    struct SwapParams {
        address to;
        address[] path;
        address[] pool;
        uint deadline;
    }
    function swapExactTokensForTokens(
        uint256 amountIn, 
        uint256 amountOutMin, 
        SwapParams calldata params
    ) external returns (uint256[] memory amounts);
    function swapExactETHForTokens(
        uint256 amountOutMin, 
        SwapParams calldata p
    ) external payable returns (uint256[] memory amounts);
    function swapExactTokensForETH(
        uint256 amountIn, 
        uint256 amountOutMin, 
        SwapParams calldata p
    ) external returns (uint256[] memory amounts);
}
interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
}
contract MiniKLAYSwap {
    address public constant routerAddress = 0xe0fbB27D0E7F3a397A67a9d4864D4f4DD7cF8cB9;
    address public constant MBX_TOKEN_ADDRESS = 0xD068c52d81f4409B9502dA926aCE3301cc41f623;
    address public constant sKAI_TOKEN_ADDRESS = 0x37d46C6813B121d6A27eD263AeF782081ae95434;
    address public constant WKLAY_ADDRESS = 0x19Aac5f612f524B754CA7e7c41cbFa2E981A4432;
    IKlaySwapRouterV2 public immutable swapRouter = IKlaySwapRouterV2(routerAddress);
    IERC20 public immutable MBX_TOKEN = IERC20(MBX_TOKEN_ADDRESS);
    IERC20 public immutable SKAI_TOKEN = IERC20(sKAI_TOKEN_ADDRESS);    
    address[] private pool =  [address(0)];
    address[] private path =  [MBX_TOKEN_ADDRESS, WKLAY_ADDRESS];
    address[] private path1 =  [WKLAY_ADDRESS, sKAI_TOKEN_ADDRESS];
    address[] private path2 =  [sKAI_TOKEN_ADDRESS, WKLAY_ADDRESS];
    // must give contract ownership of input token
    // approve this contract address(this) of amount in; 
    // this approval enables the transfer of input token to this contract: address(this)
    function swapExactTokensForTokens(uint256 amountIn)
        external
        returns (uint256[] memory amountOut)
    {
        MBX_TOKEN.transferFrom(msg.sender, address(this), amountIn);
        MBX_TOKEN.approve(address(swapRouter), amountIn);
        IKlaySwapRouterV2.SwapParams memory params = IKlaySwapRouterV2
            .SwapParams({
                to: msg.sender,
                path: path,
                pool: pool,
                deadline: block.timestamp        
            });
        amountOut = swapRouter.swapExactTokensForTokens(amountIn, 1, params);
    }
    function swapExactKLAYForTokens()
                external
                payable 
                returns (uint256[] memory amountOut)
            {
            IKlaySwapRouterV2.SwapParams memory params = IKlaySwapRouterV2
                .SwapParams({
                    to: msg.sender,
                    path: path1,
                    pool: pool,
                    deadline: block.timestamp        
                });
            amountOut = swapRouter.swapExactETHForTokens{value: msg.value}(1, params);
    }
    // must give contract ownership of input token
    // approve this contract address(this) of amount in; 
    // this approval enables the transfer of input token to address(this)
    function swapExactTokensForKLAY(uint256 amountIn)
                external 
                returns (uint256[] memory amountOut)
            {
            
            SKAI_TOKEN.transferFrom(msg.sender, address(this), amountIn);
            SKAI_TOKEN.approve(address(swapRouter), amountIn);
            IKlaySwapRouterV2.SwapParams memory params = IKlaySwapRouterV2
                .SwapParams({
                    to: msg.sender,
                    path: path2,
                    pool: pool,
                    deadline: block.timestamp        
                });
            amountOut = swapRouter.swapExactTokensForETH(amountIn, 1, params);
    }
}
