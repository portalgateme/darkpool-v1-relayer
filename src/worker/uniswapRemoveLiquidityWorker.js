const pgDarkPoolUniswapLiquidityABI = require('../../abis/pgDarkPoolUniswapLiquidityAssetManager.abi.json')
const {
    pgDarkPoolUniswapLiquidityAssetManager,
    gasLimits,
} = require('../config/config')

const { getLiquidity } = require('../defi/uniswap')
const { calculateFeeForTokens } = require('../modules/fees')

const { BaseWorker } = require('./baseWorker')

class UniswapRemoveLiquidityWorker extends BaseWorker {

    getContractCall(contract, data, gasRefunds) {
        let calldata

        const param = {
            merkleRoot: data.merkleRoot,
            positionNote: {
                assetAddress: data.nftAddress,
                amount: data.tokenId,
                nullifier: data.nullifier,
            },
            outNoteFooters: [data.outNoteFooter1, data.outNoteFooter2],
            relayerGasFees: gasRefunds,
            deadline: data.deadline,
            relayer: data.relayer,
            amountsMin: [data.amount1Min, data.amount2Min],
        }
        calldata = contract.methods.uniswapRemoveLiquidity(param, data.proof)

        return calldata
    }

    async estimateGas(web3, data) {
        const contract = this.getContract(web3, data)

        const contractCall = this.getContractCall(contract, data, [data.relayerGasFeeFromToken1, data.relayerGasFeeFromToken2])
        try {
            const gasLimit = await contractCall.estimateGas()
            return gasLimit
        } catch (error) {
            console.error('Estimate gas failed: ', error)
            return gasLimits['DEFI_WITH_EXTRA']
        }
    }

    getContract(web3, data) {
        return new web3.eth.Contract(pgDarkPoolUniswapLiquidityABI.abi, pgDarkPoolUniswapLiquidityAssetManager)
    }

    async getTxObj(web3, data, gasFee) {
        const contract = this.getContract(web3, data)
        const { token0Address, token1Address, token0Amount, token1Amount, fee0, fee1 } = await getLiquidity(web3, data.tokenId)
        const fees = await calculateFeeForTokens(gasFee, [token0Address, token1Address], [token0Amount + fee0, token1Amount + fee1])
        if (fees[0].gasFeeInToken + fees[0].serviceFeeInToken > token0Amount + fee0
            || fees[1].gasFeeInToken + fees[1].serviceFeeInToken > token1Amount + fee1) {
            throw new Error('Insufficient amount to pay fees')
        }

        const contractCall = this.getContractCall(contract, data, [fees[0].gasFeeInToken, fees[1].gasFeeInToken])

        return {
            to: contract._address,
            data: contractCall.encodeABI(),
            gasLimit: gasLimits['DEFI_WITH_EXTRA'],
        }
    }
}

module.exports = {
    UniswapRemoveLiquidityWorker
}