const theDeepAbi = require('../../abis/thedeep/ITheDeep.json')


async function getTokens(web3, vaultAddress) {
    const contract = new web3.eth.Contract(theDeepAbi.abi, vaultAddress)
    try {
        const token0 = await contract.methods.token0().call()
        const token1 = await contract.methods.token1().call()
        return { token0, token1 }
    } catch (error) {
        throw new RelayerError('Failed to get tokens', error)
    }
}

module.exports = {
    getTokens
}