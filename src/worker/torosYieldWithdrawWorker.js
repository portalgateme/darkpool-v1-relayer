const torosAssetManagerAbi = require('../../abis/pgDarkPoolTorosAssetManager.json')

const {
    pgDarkPoolTorosAssetManager,
    gasLimits,
} = require('../config/config')
const { calculateFeesForOneToken } = require('../modules/fees')
const { getOriginalToken } = require('../defi/stakingService')
const { getNftInfo } = require('../defi/torosService')

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
        const [sgToken,sgTokenAmount,torosToken,torosTokenAmount] = await getNftInfo(web3, data.nftId)

        const originalAsset = await getOriginalToken(web3, sgToken)
        const { gasFeeInToken, serviceFeeInToken } = await calculateFeesForOneToken(gasFee, originalAsset, sgTokenAmount)
        if (gasFeeInToken + serviceFeeInToken > BigInt(sgTokenAmount)) {
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
    TorosYieldWithdrawWorker
}