const rocketPoolStakeAssetManagerAbi = require('../../abis/pgDarkPoolRocketPoolStakeAssetManager.json')
const config = require('../config/config')

const {
    pgDarkPoolRocketPoolStakeAssetManager,
    gasLimits,
} = require('../config/config')
const { calculateFeesForOneToken } = require('../modules/fees')
const { toBN } = require('../utils')

const { BaseWorker } = require('./baseWorker')

class RocketPoolUnStakeWorker extends BaseWorker {

    getContractCall(contract, data, refund) {
        let calldata = contract.methods.rocketPoolWithdraw(
            data.proof,
            data.merkleRoot,
            data.nullifier,
            data.amount,
            data.noteFooterOut,
            data.relayer,
            refund)

        return calldata
    }

    async estimateGas(web3, data) {
        const contract = this.getContract(web3)
        const contractCall = this.getContractCall(contract, data, data.refund)
        return await contractCall.estimateGas({ from: data.relayer })
    }

    getContract(web3) {
        return new web3.eth.Contract(rocketPoolStakeAssetManagerAbi.abi, pgDarkPoolRocketPoolStakeAssetManager)
    }

    async getTxObj(web3, data, gasFee) {
        const contract = this.getContract(web3)
        const {gasFeeInToken, serviceFeeInToken} = await calculateFeesForOneToken(gasFee, config.nativeToken, data.amount)
        if(gasFeeInToken+ serviceFeeInToken > BigInt(data.amount)){
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
    RocketPoolUnStakeWorker
}