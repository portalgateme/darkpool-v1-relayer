const pgDarkPoolAerodromeUniversalSwapAssetManagerAbi = require('../../abis/pgDarkPoolAerodromeUniversalSwapAssetManager.json')

const {
    pgDarkPoolAerodromeUniversalSwapAssetManager,
    gasLimits,
} = require('../config/config')

const { BaseWorker } = require('./baseWorker')
const { calculateFeesForOneToken } = require('../modules/fees')


class AerodromSwapWorker extends BaseWorker {

    getContractCall(contract, data, gasRefund) {
        let calldata

        const param = {
            merkleRoot: data.merkleRoot,
            nullifier: data.inNullifier,
            assetIn: data.inAsset,
            amountIn: data.inAmount,
            assetOut: data.outAsset,
            routeHash: data.routeHash,
            deadline: data.deadline,
            noteFooter: data.outNoteFooter,
            gasRefund: gasRefund,
            commandDatas: data.routes,
            commands: data.command,
        }
        calldata = contract.methods.aerodromeSwap(data.proof, param)

        return calldata
    }

    async estimateGas(web3, data) {
        const contract = this.getContract(web3)
        const contractCall = this.getContractCall(contract, data, data.gasRefund)
        return await contractCall.estimateGas({ from: data.relayer })
    }

    getContract(web3) {
        return new web3.eth.Contract(pgDarkPoolAerodromeUniversalSwapAssetManagerAbi.abi, pgDarkPoolAerodromeUniversalSwapAssetManager)
    }

    async getTxObj(web3, data, gasFee) {
        const contract = this.getContract(web3)
        const { gasFeeInToken, serviceFeeInToken } = await calculateFeesForOneToken(gasFee, data.outAsset, data.inAmount)
        const contractCall = this.getContractCall(contract, data, gasFeeInToken)

        return {
            to: contract._address,
            data: contractCall.encodeABI(),
            gasLimit: gasLimits['DEFI_WITH_EXTRA'],
        }
    }
}

module.exports = {
    AerodromSwapWorker
}