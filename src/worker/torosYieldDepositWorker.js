const torosAssetManagerAbi = require('../../abis/pgDarkPoolTorosAssetManager.json')

const {
    pgDarkPoolTorosAssetManager,
    gasLimits,
} = require('../config/config')
const { calculateFeesForOneToken } = require('../modules/fees')

const { BaseWorker } = require('./baseWorker')

class TorosYieldDepositWorker extends BaseWorker {

    getContractCall(contract, data, refund) {
        let calldata = contract.methods.torosDeposit(
            data.proof,
            data.merkleRoot,
            data.nullifier,
            data.asset,
            data.amount,
            data.torosPoolAddress,
            data.torosUnderlyingAsset,
            data.noteFooter,
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
        const { gasFeeInToken, serviceFeeInToken } = await calculateFeesForOneToken(gasFee, originalAsset, data.amount)
        if (gasFeeInToken + serviceFeeInToken > BigInt(data.amount)) {
            throw new Error('Insufficient amount to pay fees')
        }

        const contractCall = this.getContractCall(contract, data, gasFeeInToken)

        return {
            to: contract._address,
            data: contractCall.encodeABI(),
            gasLimit: gasLimits['DEFI_WITH_EXTRA'],
        }
    }
}

module.exports = {
    TorosYieldDepositWorker
}