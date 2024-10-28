const torosAssetManagerAbi = require('../../abis/pgDarkPoolTorosAssetManager.json')

const {
    pgDarkPoolTorosAssetManager,
    gasLimits,
} = require('../config/config')
const { calculateFeesForOneToken } = require('../modules/fees')

const { BaseWorker } = require('./baseWorker')

class TorosYieldWithdrawWorker extends BaseWorker {

    getContractCall(contract, data, refund) {
        let calldata = contract.methods.torosWithdraw(
            data.proof,
            data.merkleRoot,
            data.nullifier,
            data.nftId,
            data.slippageTolerance,
            [data.noteFooter, data.noteFooterProfit],
            data.relayer,
            refund)

        return calldata
    }

    async estimateGas(web3, data) {
        const contract = this.getContract(web3)
        const contractCall = this.getContractCall(contract, data, data.refund)
        return await contractCall.estimateGas()
    }

    getContract(web3) {
        return new web3.eth.Contract(torosAssetManagerAbi.abi, pgDarkPoolTorosAssetManager)
    }

    async getTxObj(web3, data, gasFee) {
        const contract = this.getContract(web3)
        const originalAsset = await this.getOriginalToken(web3, data.asset)
        const { gasFeeInToken, serviceFeeInToken } = await calculateFeesForOneToken(gasFee, originalAsset, data.inAmount)
        if (gasFeeInToken + serviceFeeInToken > BigInt(data.amount)) {
            throw new Error('Insufficient amount to pay fees')
        }

        console.log(gasFee, gasFeeInToken, serviceFeeInToken, BigInt(data.amount))

        const contractCall = this.getContractCall(contract, data, gasFeeInToken)

        return {
            to: contract._address,
            data: contractCall.encodeABI(),
            gasLimit: gasLimits['DEFI_WITH_EXTRA'],
        }
    }
}

module.exports = {
    TorosYieldWithdrawWorker
}