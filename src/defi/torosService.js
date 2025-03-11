const SgtvNftABI = require('../../abis/toros/ISgtvNft.json')


const {
    pgDarkPoolSgtvNft,
} = require('../config/config')
const { RelayerError } = require('../utils')


async function getNftInfo(web3, nftId) {
    const contract = new web3.eth.Contract(SgtvNftABI.abi, pgDarkPoolSgtvNft)
    try {
        return await contract.methods.getNftInfo(nftId).call()
        
    } catch (error) {
        throw new RelayerError('Failed to get NFT info', error)
    }
}


module.exports = {
    getNftInfo
}