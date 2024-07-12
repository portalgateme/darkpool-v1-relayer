require('dotenv').config()

const pgConfig = require('./pgDarkPoolConfig')
const { gasLimitConfig, gasUnitFallbackConfig, maxPriorityFeeConfig, DEFAULT_MAX_PRIORITY_FEE } = require('./gasConfig')
const { stakingTokenConfig } = require('./stakingConfig')

const netId = Number(process.env.NET_ID) || 1

module.exports = {
  netId,
  redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  httpRpcUrl: process.env.HTTP_RPC_URL,
  oracleRpcUrl: process.env.ORACLE_RPC_URL || 'https://mainnet.infura.io/',
  nativeToken: pgConfig[`netId${netId}`].nativeToken,
  offchainOracleAddress: pgConfig[`netId${netId}`].offchainOracleAddress,
  pgDarkPoolAssetManager: pgConfig[`netId${netId}`].darkpoolAssetManager,
  pgDarkPoolUniswapSwapAssetManager: pgConfig[`netId${netId}`].uniswapSwapAssetManager,
  pgDarkPoolUniswapLiquidityAssetManager: pgConfig[`netId${netId}`].uniswapLiquidityAssetManager,
  pgDarkPoolCurveMultiExchangeAssetManager: pgConfig[`netId${netId}`].curveMultiExchangeAssetManager,
  pgDarkPoolCurveAddLiquidityAssetManager: pgConfig[`netId${netId}`].curveAddLiquidityAssetManager,
  pgDarkPoolCurveRemoveLiquidityAssetManager: pgConfig[`netId${netId}`].curveRemoveLiquidityAssetManager,
  pgDarkPoolCurveFSNAddLiquidityAssetManager: pgConfig[`netId${netId}`].curveFSNAddLiquidityAssetManager,
  pgDarkPoolCurveFSNRemoveLiquidityAssetManager: pgConfig[`netId${netId}`].curveFSNRemoveLiquidityAssetManager,
  pgDarkPoolCurveMPAddLiquidityAssetManager: pgConfig[`netId${netId}`].curveMPAddLiquidityAssetManager,
  pgDarkPoolCurveMPRemoveLiquidityAssetManager: pgConfig[`netId${netId}`].curveMPRemoveLiquidityAssetManager,
  pgDarkPoolStakingAssetManager: pgConfig[`netId${netId}`].stakingAssetManager,
  pgDarkPoolStakingOperator: pgConfig[`netId${netId}`].stakingOperator,
  pgDarkPoolRocketPoolStakeAssetManager: pgConfig[`netId${netId}`].rocketPoolStakeAssetManager,
  uniswapNfpManager: pgConfig[`netId${netId}`].uniswapNfpManager,
  uniswapFactory: pgConfig[`netId${netId}`].uniswapFactory,



  pgDarkPoolVerifierHub: pgConfig[`netId${netId}`].verifierHub,
  privateKey: process.env.PRIVATE_KEY,
  port: process.env.APP_PORT || 8000,
  pgServiceFee: Number(process.env.REGULAR_PG_DARKPOOL_SERVICE_FEE),
  rewardAccount: process.env.REWARD_ACCOUNT,
  gasLimits: gasLimitConfig[netId],
  gasUnitFallback: gasUnitFallbackConfig[netId],
  minimumBalance: '500000000000000000',
  baseFeeReserve: Number(process.env.BASE_FEE_RESERVE_PERCENTAGE),
  stakingTokenMapping: stakingTokenConfig[netId],
  skipDefaultPriceOrace: pgConfig[`netId${netId}`].skipDefaultPriceOrace ? true : false,
  maxPriorityFee: maxPriorityFeeConfig[netId] ?? DEFAULT_MAX_PRIORITY_FEE,
}