const StakingOperatorABI = require('../../abis/pgDarkPoolStakingOperator.abi.json')


const {
    pgDarkPoolStakingOperator,
} = require('../config/config')


async function getOriginalToken(web3, zkAsset) {
    const contract = new web3.eth.Contract(StakingOperatorABI.abi, pgDarkPoolStakingOperator)
    const originalToken = await contract.methods.getOriginalToken(zkAsset).call()

    return originalToken
}


module.exports = {
    getOriginalToken
}