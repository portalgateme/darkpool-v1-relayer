const theDeepVaultAssetManagerAbi = require('../../abis/pgDarkPoolTheDeepVaultAssetManager.json')

const {
    pgDarkPoolTheDeepVaultAssetManager,
    gasLimits,
} = require('../config/config')

const { calculateFeeForTokens } = require('../modules/fees')
const { BaseWorker } = require('./baseWorker')

class TheDeepWithdrawWorker extends BaseWorker {

    getContractCall(contract, data, refund) {
        let calldata = contract.methods.theDeepWithdraw(
            {
                merkleRoot: data.merkleRoot,
                vaultAddress: data.vaultAddress,
                amount: data.amount,
                nullifier: data.nullifier,
                gasRefund: refund,
                outNoteFooters: [data.outNoteFooter1, data.outNoteFooter2],
                assetsOut: [data.outAsset1, data.outAsset2]
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

    async quoteDecreaseLiquidity(web3, data) {
        const contract = this.getContract(web3)
        const result = await contract.methods.quoteDecreaseLiquidity(data.amount, data.vaultAddress).call()
        return [BigInt(result['0']), BigInt(result['1'])]
    }

    getContract(web3) {
        return new web3.eth.Contract(theDeepVaultAssetManagerAbi.abi, pgDarkPoolTheDeepVaultAssetManager)
    }

    async getTxObj(web3, data, gasFee) {
        const contract = this.getContract(web3)
        const [token0Amount, token1Amount] = await this.quoteDecreaseLiquidity(web3, data)
        const fees = await calculateFeeForTokens(gasFee, [data.outAsset1, data.outAsset2], [token0Amount, token1Amount])
        if (fees[0].gasFeeInToken + fees[0].serviceFeeInToken > token0Amount
            || fees[1].gasFeeInToken + fees[1].serviceFeeInToken > token1Amount) {
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
    TheDeepWithdrawWorker
}