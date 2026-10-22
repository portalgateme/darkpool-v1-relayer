const pgVerifierHubABI = require('../../abis/pgIVerifierHub.abi')
const pgVerifierABI = require('../../abis/pgIVerifier.abi')
const {pgDarkPoolVerifierHub} = require('../config/config')
const {jobType} = require('../config/constants')
const {RelayerError } = require('../utils')

const verifierMap = {
   [jobType.PG_DARKPOOL_WITHDRAW]: 'withdraw',
   [jobType.PG_DARKPOOL_UNISWAP_SINGLESWAP]: 'uniswapSwap',
   [jobType.PG_DARKPOOL_UNISWAP_LP]: 'uniswapLiquidityProvision',
   [jobType.PG_DARKPOOL_UNISWAP_REMOVE_LIQUIDITY]: 'uniswapRemoveLiquidity',
   [jobType.PG_DARKPOOL_UNISWAP_FEE_COLLECTING]: 'uniswapCollectFees',
   [jobType.PG_DARKPOOL_CURVE_MULTI_EXCHANGE]: 'curveMultiExchange',
   [jobType.PG_DARKPOOL_CURVE_ADD_LIQUIDITY]: 'curveAddLiquidity',
   [jobType.PG_DARKPOOL_CURVE_REMOVE_LIQUIDITY]: 'curveRemoveLiquidity',
   [jobType.PG_DARKPOOL_ZK_STAKE]: 'zkLockNote',
   [jobType.PG_DARKPOOL_ZK_REDEEM]: 'zkUnlockNote',
   [jobType.PG_DARKPOOL_ROCKET_POOL_STAKE]: 'rocketPoolStake',
   [jobType.PG_DARKPOOL_ROCKET_POOL_UNSTAKE]: 'rocketPoolStake',
   [jobType.PG_DARKPOOL_SABLIER_CLAIM] : 'sablierClaimStream',
   [jobType.PG_DARKPOOL_INFRA]: 'generalDefiIntegration',
   [jobType.PG_DARKPOOL_AERODROME_ADD_LIQUIDITY]: 'aerodromeAddLiquidity',
   [jobType.PG_DARKPOOL_AERODROME_REMOVE_LIQUIDITY]: 'aerodromeRemoveLiquidity',
   [jobType.PG_DARKPOOL_AERODROME_SWAP]: 'aerodromeSwap',
   [jobType.PG_DARKPOOL_TOROS_YIELD_DEPOSIT]: 'torosDeposit',
   [jobType.PG_DARKPOOL_TOROS_YIELD_WITHDRAW]: 'torosWithdraw',
   [jobType.PG_DARKPOOL_THE_DEEP_NOTE_DEPOSIT]: 'thedeepNoteDeposit',
   [jobType.PG_DARKPOOL_THE_DEEP_WITHDRAW]: 'thedeepWithdraw',
 }

// Errors of the UltraHonk verifiers (bb 5.2.0) that mean the proof is invalid
const invalidProofErrors = [
   '0x9fc3a218', // SumcheckFailed()
   '0xa5d82e8a', // ShpleminiFailed()
   '0xed74ac0a', // ProofLengthWrong()
   '0x59895a53', // ProofLengthWrongWithLogN(uint256,uint256,uint256)
   '0xfa066593', // PublicInputsLengthWrong()
   '0xeb73e0bd', // ValueGeLimbMax()
   '0x607be13e', // ValueGeGroupOrder()
   '0x20a33589', // ValueGeFieldOrder()
   '0x4ddaa5e5', // PointAtInfinity()
   '0xa2a2ac83', // ConsistencyCheckFailed()
   '0x835eb8f7', // GeminiChallengeInSubgroup()
   '0xb2c952e2', // InvertOfZero()
]

async function zkProofVerifier(web3, proof, input, job) {
   let verifierName = verifierMap[job]
   if(!verifierName) {
      throw new RelayerError('Unknown job type.' , 0)
   }
   const hubContract = new web3.eth.Contract(pgVerifierHubABI, pgDarkPoolVerifierHub)
   const verifierContractAddress = await hubContract.methods.getVerifier(verifierName).call()

   const verifierContract = new web3.eth.Contract(pgVerifierABI, verifierContractAddress)
   try {
      return await verifierContract.methods.verify(proof, input).call()
   } catch (e) {
      const revertData = `${e.message} ${typeof e.data === 'string' ? e.data : JSON.stringify(e.data || '')}`
      if (invalidProofErrors.some((selector) => revertData.indexOf(selector) !== -1)) {
         return false
      }
      throw new RelayerError('Proof fail, Please try again later' , 0)
   }
}

module.exports = {
   zkProofVerifier,
}