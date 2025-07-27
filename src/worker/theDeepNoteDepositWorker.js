const theDeepVaultAssetManagerAbi = require('../../abis/pgDarkPoolTheDeepVaultAssetManager.json')

const {
    pgDarkPoolTheDeepVaultAssetManager,
    gasLimits,
} = require('../config/config')

const { calculateFeesForOneToken } = require('../modules/fees')
const { BaseWorker } = require('./baseWorker')

class TheDeepNoteDepositWorker extends BaseWorker {

    getContractCall(contract, data, refund) {
        let calldata = contract.methods.theDeepNoteDeposit(
            {
                vaultType: data.vaultType,
                merkleRoot: data.merkleRoot,
                asset1: data.asset1,
                amount1: data.amount1,
                asset2: data.asset2,
                amount2: data.amount2,
                inNullifier1: data.inNullifier1,
                inNullifier2: data.inNullifier2,
                noteFooter: data.noteFooter,
                nullifier: data.nullifier,
                vaultAddress: data.vaultAddress,
                volatility: data.volatility,
                relayer: data.relayer,
                gasRefund: refund
            },
            data.proof
        )

        return calldata
    }

    async estimateGas(web3, data) {
        const contract = this.getContract(web3)
        const contractCall = this.getContractCall(contract, data, [0n, 0n])
        return await contractCall.estimateGas({ from: data.relayer })
    }

    getContract(web3) {
        return new web3.eth.Contract(theDeepVaultAssetManagerAbi.abi, pgDarkPoolTheDeepVaultAssetManager)
    }

    async getTxObj(web3, data, gasFee) {
        const contract = this.getContract(web3)
        const depositAsset = data.amount1 > 0n ? data.asset1 : data.asset2
        const depositAmount = data.amount1 > 0n ? data.amount1 : data.amount2
        const { gasFeeInToken, serviceFeeInToken } = await calculateFeesForOneToken(gasFee, depositAsset, depositAmount)
        if (gasFeeInToken + serviceFeeInToken > depositAmount) {
            throw new Error('Insufficient amount to pay fees')
        }

        const refund1 = data.amount1 > 0n ? gasFeeInToken : 0n
        const refund2 = data.amount1 > 0n ? 0n : gasFeeInToken

        const contractCall = this.getContractCall(contract, data, [refund1, refund2])

        return {
            to: contract._address,
            data: contractCall.encodeABI(),
            gasLimit: gasLimits['DEFI_WITH_EXTRA'],
        }
    }
}

module.exports = {
    TheDeepNoteDepositWorker
}