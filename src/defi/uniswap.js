const IUniswapV3PoolABI = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json')
const nfpManagerABI = require('@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json')
const { uniswapNfpManager, uniswapFactory, netId } = require('../config/config')
const { getDecimalByAddress } = require('../utils')
const { Position, Pool, computePoolAddress } = require('@uniswap/v3-sdk')
const { Token } = require('@uniswap/sdk-core')
const ethers = require('ethers')

const MAX_UINT128 = ethers.BigNumber.from(2).pow(128).sub(1)

async function getLiquidity(web3, tokenId) {
    const contract = new web3.eth.Contract(nfpManagerABI.abi, uniswapNfpManager)
    const result = await contract.methods.positions(tokenId).call()
    const token0Address = result.token0
    const token1Address = result.token1
    const liquidity = result.liquidity.toString()
    const tickLower = result.tickLower
    const tickUpper = result.tickUpper
    const fee = result.fee
    const { pool, token0, token1 } = await getPool(web3, token0Address, token1Address, fee)
    const position = new Position({
        pool,
        liquidity,
        tickLower: Number(tickLower),
        tickUpper: Number(tickUpper)
    })

    const token0Amount = ethers.utils.parseUnits(position.amount0.toExact(), token0.decimals)
    const token1Amount = ethers.utils.parseUnits(position.amount1.toExact(), token1.decimals)

    const { fee0, fee1 } = await getUnClaimedFee(web3, tokenId)

    return {
        token0Address,
        token1Address,
        token0Amount,
        token1Amount,
        fee0,
        fee1
    }
}

async function getUnClaimedFee(web3, tokenId) {
    const contract = new web3.eth.Contract(nfpManagerABI.abi, uniswapNfpManager)
    const owner = await contract.methods.ownerOf(tokenId).call()
    if (owner == '0x' || owner == ethers.constants.AddressZero) {
        return [0n, 0n]
    }

    const result = await contract.methods.collect(
        {
            tokenId: ethers.utils.hexlify(tokenId),
            recipient: owner,
            amount0Max: MAX_UINT128,
            amount1Max: MAX_UINT128,
        }
    ).call({ from: owner })
    const fee0 = BigInt(result.amount0.toString())
    const fee1 = BigInt(result.amount1.toString())
    return { fee0, fee1 }
}

async function getPool(web3, token0Address, token1Address, feeTier) {
    const token0Decimal = await getDecimalByAddress(web3, token0Address)
    const token1Decimal = await getDecimalByAddress(web3, token1Address)
    const token0 = new Token(netId, token0Address, parseInt(token0Decimal))
    const token1 = new Token(netId, token1Address, parseInt(token1Decimal))
    const currentPoolAddress = getPoolAddress(token0, token1, feeTier)
    const poolContract = new web3.eth.Contract(IUniswapV3PoolABI.abi, currentPoolAddress)
    const slot0 = await poolContract.methods.slot0().call()
    const liquidity = await poolContract.methods.liquidity().call()
    const sqrtPriceX96 = slot0[0]
    const tick = slot0[1]
    const pool = new Pool(token0, token1, Number(feeTier), sqrtPriceX96, liquidity, Number(tick))
    return { pool, token0, token1 }
}

function getPoolAddress(token1, token2, feeTier) {
    return computePoolAddress({
        factoryAddress: uniswapFactory,
        tokenA: token1,
        tokenB: token2,
        fee: feeTier,
    })
}

module.exports = {
    getLiquidity
}