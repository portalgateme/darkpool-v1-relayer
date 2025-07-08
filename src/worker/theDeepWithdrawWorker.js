const theDeepVaultAssetManagerAbi = require('../../abis/pgDarkPoolTheDeepVaultAssetManager.json')

const {
    pgDarkPoolTheDeepVaultAssetManager,
    gasLimits,
} = require('../config/config')

const { BaseWorker } = require('./baseWorker')

class TheDeepWithdrawWorker extends BaseWorker {

    getContractCall(contract, data, refund) {
        let calldata = contract.methods.theDeepWithdraw(
            [
                data.merkleRoot,
                data.vaultAddress,
                data.amount,
                data.nullifier,
                [data.outNoteFooter1, data.outNoteFooter2],
                [data.outAsset1, data.outAsset2]
            ],
            data.proof
        )

        return calldata
    }

    async estimateGas(web3, data) {
        const contract = this.getContract(web3)
        const contractCall = this.getContractCall(contract, data, data.refund)
        return await contractCall.estimateGas()
    }

    getContract(web3) {
        return new web3.eth.Contract(theDeepVaultAssetManagerAbi.abi, pgDarkPoolTheDeepVaultAssetManager)
    }


    async getTxObj(web3, data, gasFee) {
        const contract = this.getContract(web3)

        const contractCall = this.getContractCall(contract, data, data.refund)

        return {
            to: contract._address,
            data: contractCall.encodeABI(),
            gasLimit: gasLimits['DEFI_WITH_EXTRA'],
        }
    }
}

module.exports = {
    TheDeepWithdrawWorker
}