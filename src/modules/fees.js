const { RelayerError, toBN, toWei, isETH, getRateToEth } = require('../utils')
const { pgServiceFee } = require('../config/config')
const { getPriceToNativeFromLLama } = require('./priceOracle')
const { GasPriceOracle } = require('gas-price-oracle')
const { oracleRpcUrl } = require('../config/config')
const config = require('../config/config')
const { ChainId } = require('../config/constants')
const priceWeb3 = require('./web3')('oracle')

const NATIVE_DECIMAL = 18
const PRECISION = 1000000
const GAS_PRECISION = 10
const GAS_UNIT_BUFF = 1
const GAS_PRIORITY_BUFF = 2
const MAX_PRIORITY_FEE_PRECISION = 10 ** 9
const PRIORITY_FEE_BLOCKS = config.netId === ChainId.MAINNET ? 5 : 20
const PRIORITY_FEE_PERCENTILE = 75

const gasPriceOracle = new GasPriceOracle({ defaultRpc: oracleRpcUrl })

// Mainnet uses the sending RPC; other chains retain the oracle RPC.
// The next block's base fee is the last entry of eth_feeHistory's baseFeePerGas,
// and the priority fee, which is the median over the last PRIORITY_FEE_BLOCKS blocks of each block's
// PRIORITY_FEE_PERCENTILE-th percentile tip, capped by the chain's maxPriorityFee (gasConfig.js).
// The worker charges and sends with the same priorityFee. Returns null on chains without EIP-1559.
async function getFeeParams(web3 = priceWeb3) {
    const feeWeb3 = config.netId === ChainId.MAINNET ? web3 : priceWeb3
    const cap = toBN(Math.round(config.maxPriorityFee * MAX_PRIORITY_FEE_PRECISION))
    try {
        const { baseFeePerGas, reward } = await feeWeb3.eth.getFeeHistory(PRIORITY_FEE_BLOCKS, 'latest', [PRIORITY_FEE_PERCENTILE])
        if (!baseFeePerGas || baseFeePerGas.length === 0) {
            return null
        }
        const baseFee = toBN(baseFeePerGas[baseFeePerGas.length - 1])
        if (!reward || reward.length === 0) {
            return { baseFee, priorityFee: cap }
        }
        const tips = reward.map((r) => toBN(r[0])).sort((a, b) => a.cmp(b))
        const median = tips[Math.floor(tips.length / 2)]
        return { baseFee, priorityFee: median.lt(cap) ? median : cap }
    } catch (e) {
        console.error('eth_feeHistory failed, using latest base fee and maxPriorityFee', e.message)
        const block = await feeWeb3.eth.getBlock('latest')
        return block && block.baseFeePerGas ? { baseFee: toBN(block.baseFeePerGas), priorityFee: cap } : null
    }
}

async function getGasPrice(feeParams) {
    if (feeParams) {
        console.log("=====baseFeePerGas,priorityFee:", feeParams.baseFee.toString(), feeParams.priorityFee.toString());
        return feeParams.baseFee.add(feeParams.priorityFee)
    }

    const { fast } = await gasPriceOracle.gasPrices()
    return toBN(toWei(fast.toString(), 'gwei'))
}

async function calcGasFee(web3, gasAmount, feeParams) {
    const gasPrice = await getGasPrice(feeParams)
    const refinedGasPrice = gasPrice.mul(toBN(GAS_PRECISION + GAS_PRIORITY_BUFF)).div(toBN(GAS_PRECISION))
    const refinedGasAmount = toBN(gasAmount).mul(toBN(GAS_PRECISION + GAS_UNIT_BUFF)).div(toBN(GAS_PRECISION))
    const gasFee = BigInt(refinedGasPrice.mul(refinedGasAmount))
    console.log("=====gasPrice, gasAmount, gasFee :", BigInt(gasPrice), gasAmount, gasFee.toString());
    return gasFee
}

// EIP-1559 params for the relayed tx: the tip is the one the user was charged for, and maxFeePerGas leaves
// room for the base fee of the sending chain to double before inclusion (only the actual base fee is paid).
// Capped by maxGasPrice (gwei), as tx-manager does for the params it estimates itself.
async function getTxGasParams(web3, feeParams, maxGasPrice) {
    if (!feeParams) {
        return {}
    }
    let nextBaseFee = feeParams.baseFee
    if (config.netId !== ChainId.MAINNET) {
        const { baseFeePerGas } = await web3.eth.getFeeHistory(1, 'latest', [])
        nextBaseFee = toBN(baseFeePerGas[baseFeePerGas.length - 1])
    }
    const cap = toBN(toWei(String(maxGasPrice), 'gwei'))
    let maxFeePerGas = nextBaseFee.muln(2).add(feeParams.priorityFee)
    if (maxFeePerGas.gt(cap)) {
        maxFeePerGas = cap
    }
    const maxPriorityFeePerGas = feeParams.priorityFee.lt(maxFeePerGas) ? feeParams.priorityFee : maxFeePerGas
    return {
        type: 2,
        maxFeePerGas: '0x' + maxFeePerGas.toString(16),
        maxPriorityFeePerGas: '0x' + maxPriorityFeePerGas.toString(16),
    }
}

function ethToToken(ethAmount, rateToEth) {
    return ethAmount * BigInt(10 ** NATIVE_DECIMAL) / rateToEth
}

function tokenToEth(tokenAmount, rateToEth) {
    return tokenAmount * BigInt(rateToEth) / BigInt(10 ** NATIVE_DECIMAL)
}

async function rateToEth(asset) {
    const isEth = isETH(asset)
    if (isEth) {
        return BigInt(10 ** NATIVE_DECIMAL);
    } else {
        const rate = await getRateToEth(asset, true)
        return BigInt(rate.toString())
    }
}

function calcServiceFee(amount) {
    return BigInt(amount) * BigInt(pgServiceFee) / BigInt(PRECISION);
}

async function calculateFeesForOneToken(gasFeeInEth, asset, amount) {
    let rate = 0n
    if (!config.skipDefaultPriceOrace) {
        rate = await rateToEth(asset)
    }
    
    if (rate == 0n) {
        console.log("fallback to defillma for price", asset, config.skipDefaultPriceOrace)
        const prices = await getPriceToNativeFromLLama([asset]);
        rate = prices[asset];
    }

    const gasFeeInToken = ethToToken(gasFeeInEth, rate)

    const serviceFeeInToken = calcServiceFee(amount)

    return {
        gasFeeInToken,
        serviceFeeInToken,
    }
}

async function calculateFeeForTokens(gasFeeInEth, assets, amounts) {
    let tmpTotal = BigInt(0);
    let tmpRateAndAmount = [];
    let rateDict = {};
    let fallbackAssets = [];
    for (let i = 0; i < assets.length; i++) {
        const asset = assets[i]
        const amount = BigInt(amounts[i])
        if (amount != 0n) {
            const rate = await rateToEth(asset);
            if (rate == 0n) {
                fallbackAssets.push(asset);
            } else {
                rateDict[asset] = rate;
            }
        }
    }

    if (fallbackAssets.length > 0) {
        const prices = await getPriceToNativeFromLLama(fallbackAssets);
        for (const asset of fallbackAssets) {
            rateDict[asset] = prices[asset];
        }
    }

    for (let i = 0; i < assets.length; i++) {
        const asset = assets[i]
        const amount = BigInt(amounts[i])
        if (amount === 0n) {
            tmpRateAndAmount.push({ rate: 0n, ethAmount: 0n, amount: 0n });
        } else {
            const rate = rateDict[asset];
            const ethAmount = tokenToEth(amount, rate);
            tmpTotal = tmpTotal + ethAmount;
            tmpRateAndAmount.push({ rate, ethAmount, amount });
        }
    }

    if (tmpTotal == BigInt(0)) {
        throw new RelayerError("Insufficient amount");
    }

    let fees = []
    for (const { rate, ethAmount, amount } of tmpRateAndAmount) {
        if (amount === 0n) {
            fees.push({
                gasFeeInToken: 0n,
                serviceFeeInToken: 0n,
            })
        } else {
            const tokenGasFeeInEth = ethAmount * gasFeeInEth / tmpTotal;
            const gasFeeInToken = ethToToken(tokenGasFeeInEth, rate);
            const serviceFeeInToken = calcServiceFee(amount)
            fees.push({
                gasFeeInToken,
                serviceFeeInToken,
            })
        }
    }

    return fees
}

module.exports = {
    calculateFeesForOneToken,
    calculateFeeForTokens,
    calcGasFee,
    getFeeParams,
    getTxGasParams,
}
