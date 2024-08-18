const { ChainId } = require('./constants')

module.exports = {
  [ChainId.MAINNET]: {
    nativeToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    rETHAddress: '0xae78736Cd615f374D3085123A210448E74Fc6393',
    offchainOracleAddress: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    verifierHub: '0x6c3Fac202241F3c6B19EBCa043091E3aab21F3F2',
    curveAddLiquidityAssetManager: '0xEBeD6c7C2189bf8ad6687D3A4cf4b83fB4D1a3D2',
    curveFSNAddLiquidityAssetManager: '0x43fbE6066886F7b89EA6091f6cea8E3AD0FA7C71',
    curveFSNRemoveLiquidityAssetManager: '0xfdA33b941E6C014bD079C6917b815EFA58976f37',
    curveMPAddLiquidityAssetManager: '0x84eb120A35802460484015e6748375369e40468a',
    curveMPRemoveLiquidityAssetManager: '0xC4e979C922E93938dBaBb6e1623a19cbc6132489',
    curveMultiExchangeAssetManager: '0x3D76Fd85FCc2593970d22Aa34bcC4c5444c57c9D',
    curveRemoveLiquidityAssetManager: '0xfBf0dDceF9360757fCA368911b6719a35DD8C660',
    curveSingleExchangeAssetManager: '0xB1CC5D9227323330E8a58e891c123B38D03f0BAA',
    darkpoolAssetManager: '0x159F3668c72BBeCdF1fb31beeD606Ec9649654eB',
    uniswapLiquidityAssetManager: '0x53e5A08c95CF866E34F2A6A685ee9f90366e154E',
    uniswapSwapAssetManager: '0xc98b275a309f187b691e025b956e03603e12b420',
    rocketPoolStakeAssetManager: '0xEF8F70bB29DEAd5CEcaE26C6Cb19B987475B3e48',
    sablierDynamicAssetManager: '0x0Cd1600114b3e83a212e6570f8ee50988673B84e',
    sablierLinearAssetManager: '0xe0fE2642FFc6C58A324Ad65DC37B6B3f9C0f9933',
    stakingOperator: '0x539bcbc08F2cA42E50887dA4Db0DC34EbF0B090b',
    stakingAssetManager: '0x1Fa7Cb4925086128f3bb9e26761C9C75dbAC3CD1',
    generalDefiIntegrationAssetManager: '0x2bddBe60A53569be99896769b9c831ea5d3A587a',
    aerodromeAddLiquidityAssetManager: '0x0',
    aerodromeRemoveLiquidityAssetManager: '0x0',
    aerodromeSwapAssetManager: '0x0',
    //deployedBlock: 18323404,
    uniswapNfpManager: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
    uniswapFactory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    sablierV2LockupLinear: '0xAFb979d9afAd1aD27C5eFf4E27226E3AB9e5dCC9',
    sablierV2LockupDynamic: '0x7CC7e125d83A581ff438608490Cc0f7bDff79127',
  },
  [ChainId.ARBITRUM_ONE]: {
    nativeToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    offchainOracleAddress: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    verifierHub: '0x630aD89523a18fA30F752297F3F53B7BC363488b',
    // curve doesn't support arbitrum
    curveAddLiquidityAssetManager: '0x0',
    curveFSNAddLiquidityAssetManager: '0x0',
    curveFSNRemoveLiquidityAssetManager: '0x0',
    curveMPAddLiquidityAssetManager: '0x0',
    curveMPRemoveLiquidityAssetManager: '0x0',
    curveMultiExchangeAssetManager: '0x0',
    curveRemoveLiquidityAssetManager: '0x0',
    curveSingleExchangeAssetManager: '0x0',
    darkpoolAssetManager: '0xf7C40b5057a1D1a3d58B02BCdb125E63ef380564',
    uniswapLiquidityAssetManager: '0x9D4746F8f2364da04fF47d729072F71b742726aA',
    uniswapSwapAssetManager: '0xdB9ea6e600077492Ef568826AC9155159D7Da8C9',
    rocketPoolStakeAssetManager: '0x0',// rocket pool doesn't support arbitrum
    sablierDynamicAssetManager: '0x3dC5C6788E3ff47c4ba7e912cA1ceA3c8f9CAac4',
    sablierLinearAssetManager: '0xC0A5AD1f7B43794dC5d40CEdD8C809DEC4d298BB',
    stakingOperator: '0xF4f1D4F28Be82D81135c13D255452B8325B585B0',
    stakingAssetManager: '0xB1CC5D9227323330E8a58e891c123B38D03f0BAA',
    generalDefiIntegrationAssetManager: '0x2e4f46038E998663Bf8E907817B02C05Ada65BD7',
    aerodromeAddLiquidityAssetManager: '0x0',
    aerodromeRemoveLiquidityAssetManager: '0x0',
    aerodromeSwapAssetManager: '0x0',

    uniswapNfpManager: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
    uniswapFactory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    sablierV2LockupLinear: '0xFDD9d122B451F549f48c4942c6fa6646D849e8C1',
    sablierV2LockupDynamic: '0xf390cE6f54e4dc7C5A5f7f8689062b7591F7111d',
  },
  [ChainId.BounceBit]: {
    nativeToken: '0x0000000000000000000000000000000000000000',
    offchainOracleAddress: '0x0000000000000000000000000000000000000000',
    verifierHub: '0x4F526939E5e5EC49dADb8707f44DDD97543B6cBa',
    // curve doesn't support bb
    curveAddLiquidityAssetManager: '0x0',
    curveFSNAddLiquidityAssetManager: '0x0',
    curveFSNRemoveLiquidityAssetManager: '0x0',
    curveMPAddLiquidityAssetManager: '0x0',
    curveMPRemoveLiquidityAssetManager: '0x0',
    curveMultiExchangeAssetManager: '0x0',
    curveRemoveLiquidityAssetManager: '0x0',
    curveSingleExchangeAssetManager: '0x0',
    stakingOperator: '0x4d459dDe25707CA353De15CC3B85b7C2e4bb380c',
    darkpoolAssetManager: '0x722133fBb559E2849e3402De3279Bd3059b7fe4E',
    nftAssetManager: '0x0f3778d690090E6dfd0fc5948b23A55A587C558E',
    oTCSwapAssetManager: '0xAa5e02284d1Fd0f6C12AFBDABc28Ed5aC5a6474b',
    generalDefiIntegrationAssetManager: '0x881e3e5416D1b6acecD9d5BA20895D06Ecc40a28',
    stakingAssetManager: '0xe6B0a94e1eA206B122a11a30dA7FB9ADaA12ef42',
    uniswapLiquidityAssetManager: '0x0',
    uniswapSwapAssetManager: '0x0',
    // rocket pool doesn't support bb
    rocketPoolStakeAssetManager: '0x0',
    sablierDynamicAssetManager: '0x0',
    sablierLinearAssetManager: '0x0',
    aerodromeAddLiquidityAssetManager: '0x0',
    aerodromeRemoveLiquidityAssetManager: '0x0',
    aerodromeSwapAssetManager: '0x0',

    uniswapNfpManager: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
    uniswapFactory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    skipDefaultPriceOrace: true,
  },
  [ChainId.BASE]: {
    nativeToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    offchainOracleAddress: '0x0FfC4A1d000F0078d14FD32D73E98227fDca35F8',
    verifierHub: '0x0',
    curveAddLiquidityAssetManager: '0x0',
    curveFSNAddLiquidityAssetManager: '0x0',
    curveFSNRemoveLiquidityAssetManager: '0x0',
    curveMPAddLiquidityAssetManager: '0x0',
    curveMPRemoveLiquidityAssetManager: '0x0',
    curveMultiExchangeAssetManager: '0x0',
    curveRemoveLiquidityAssetManager: '0x0',
    curveSingleExchangeAssetManager: '0x0',
    darkpoolAssetManager: '0x0',
    uniswapLiquidityAssetManager: '0x0',
    uniswapSwapAssetManager: '0x0',
    aerodromeAddLiquidityAssetManager: '0x0',
    aerodromeRemoveLiquidityAssetManager: '0x0',
    aerodromeSwapAssetManager: '0x0',


    uniswapNfpManager: '0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1',
    uniswapFactory: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD',
    sablierV2LockupLinear: '0x4CB16D4153123A74Bc724d161050959754f378D8',
    sablierV2LockupDynamic: '0xF9E9eD67DD2Fab3b3ca024A2d66Fcf0764d36742',
  },
  [ChainId.SEPOLIA]: {
    nativeToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    rETHAddress: '0x',
    offchainOracleAddress: '0x4Fe44a9aC8Ef059Be2dB97f9e3bcA32Ab698C2f2',
    verifierHub: '0x9Df17C66569A6235552c5c039eAA141f7F32543F',
    curveAddLiquidityAssetManager: '0x0',
    curveFSNAddLiquidityAssetManager: '0x0',
    curveFSNRemoveLiquidityAssetManager: '0x0',
    curveMPAddLiquidityAssetManager: '0x0',
    curveMPRemoveLiquidityAssetManager: '0x0',
    curveMultiExchangeAssetManager: '0x0',
    curveRemoveLiquidityAssetManager: '0x0',
    curveSingleExchangeAssetManager: '0x0',
    aerodromeAddLiquidityAssetManager: '0x0',
    aerodromeRemoveLiquidityAssetManager: '0x0',
    aerodromeSwapAssetManager: '0x0',
    darkpoolAssetManager: '0xa10d309818527C8D8F5164f9D640515d6616bFeE',
    uniswapLiquidityAssetManager: '0x0',
    uniswapSwapAssetManager: '0x0',
    sablierDynamicAssetManager: '0x6c5Af867CB8950C92EC8F1e1382857Aa62e754F5',
    sablierLinearAssetManager: '0x992a5Ce5fF1573cBFe9712d4C500427828914645',
    stakingOperator: '0xca7081e8C689C2BA887cEaCcfCB1961716CF5fc9',
    stakingAssetManager: '0x5041cad705244626E8BB9bd6D828b94EEAB09D8b',
    generalDefiIntegrationAssetManager: '0xdDB11ee2669410557C52eC0d67997E59Fa3D7BaC',
    //deployedBlock: 9739503,
    uniswapNfpManager: '0x1238536071E1c677A632429e3655c799b22cDA52',
    uniswapFactory: '0x0227628f3F023bb0B980b67D528571c95c6DaC1c',
    sablierV2LockupLinear: '0x7a43F8a888fa15e68C103E18b0439Eb1e98E4301',
    sablierV2LockupDynamic: '0xc9940AD8F43aAD8e8f33A4D5dbBf0a8F7FF4429A',
  },
  [ChainId.BounceBitTestnet]: {
    nativeToken: '0x0000000000000000000000000000000000000000',
    rETHAddress: '0x',
    offchainOracleAddress: '0x0000000000000000000000000000000000000000',
    stakingOperator: '0xEF8F70bB29DEAd5CEcaE26C6Cb19B987475B3e48',
    verifierHub: '0x539bcbc08F2cA42E50887dA4Db0DC34EbF0B090b',
    darkpoolAssetManager: '0xf21f124F395271e8435A93063AE2AD74829D7b69',
    nftAssetManager: '0x2E6Dc65E715C6ce7154194918dF830cbfd706EF4',
    oTCSwapAssetManager: '0xe7b3a2144e936fb1Ff2f183b8C25D4171Df86F91',
    generalDefiIntegrationAssetManager: '0x1Df4fAe6CC88A19825dA7dCF8Fcac8E44BA14D2C',
    stakingAssetManager: '0x30cAA40e8D8d00fEAFc05732Ed75856f5eC7F89c',
    curveAddLiquidityAssetManager: '0x0',
    curveFSNAddLiquidityAssetManager: '0x0',
    curveFSNRemoveLiquidityAssetManager: '0x0',
    curveMPAddLiquidityAssetManager: '0x0',
    curveMPRemoveLiquidityAssetManager: '0x0',
    curveMultiExchangeAssetManager: '0x0',
    curveRemoveLiquidityAssetManager: '0x0',
    curveSingleExchangeAssetManager: '0x0',
    rocketPoolStakeAssetManager: '0x0',
    sablierDynamicAssetManager: '0x0',
    sablierLinearAssetManager: '0x0',
    uniswapLiquidityAssetManager: '0x0',
    uniswapSwapAssetManager: '0x0',
    aerodromeAddLiquidityAssetManager: '0x0',
    aerodromeRemoveLiquidityAssetManager: '0x0',
    aerodromeSwapAssetManager: '0x0',
    //deployedBlock: 9739503,
    uniswapNfpManager: '0x1238536071E1c677A632429e3655c799b22cDA52',
    uniswapFactory: '0x0227628f3F023bb0B980b67D528571c95c6DaC1c',
  },
  [ChainId.EMCTestnet]: {
    nativeToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    rETHAddress: '0x',
    offchainOracleAddress: '0x97cEf218884E6078166d436AedE081eb97Bb65c6',
    verifierHub: '0x646a26B856c982488aF753870603e41B1EE6b3ba',
    curveAddLiquidityAssetManager: '0x0',
    curveFSNAddLiquidityAssetManager: '0x0',
    curveFSNRemoveLiquidityAssetManager: '0x0',
    curveMPAddLiquidityAssetManager: '0x0',
    curveMPRemoveLiquidityAssetManager: '0x0',
    curveMultiExchangeAssetManager: '0x0',
    curveRemoveLiquidityAssetManager: '0x0',
    curveSingleExchangeAssetManager: '0x0',
    darkpoolAssetManager: '0x1115b84c9359FCD5D1DF8146F1Fd17828aaC07c2',
    uniswapLiquidityAssetManager: '0x0',
    uniswapSwapAssetManager: '0x0',
    sablierDynamicAssetManager: '0x0',
    sablierLinearAssetManager: '0x0',
    stakingOperator: '0x0',
    stakingAssetManager: '0x0',
    nftAssetManager: '0xf7C40b5057a1D1a3d58B02BCdb125E63ef380564',
    oTCSwapAssetManager: '0x9D4746F8f2364da04fF47d729072F71b742726aA',
    //deployedBlock: 9739503,
    uniswapNfpManager: '0x1238536071E1c677A632429e3655c799b22cDA52',
    uniswapFactory: '0x0227628f3F023bb0B980b67D528571c95c6DaC1c',
    sablierV2LockupLinear: '0x7a43F8a888fa15e68C103E18b0439Eb1e98E4301',
    sablierV2LockupDynamic: '0xc9940AD8F43aAD8e8f33A4D5dbBf0a8F7FF4429A',
  },
  [ChainId.HARDHAT]: {
    nativeToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    rETHAddress: '0xae78736Cd615f374D3085123A210448E74Fc6393',
    offchainOracleAddress: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',

    stakingOperator: '0x6B9C4119796C80Ced5a3884027985Fd31830555b',
    verifierHub: '0xA8d14b3d9e2589CEA8644BB0f67EB90d21079f8B',
    darkpoolAssetManager: '0xe24e7570Fe7207AdAaAa8c6c89a59850391B5276',
    nftAssetManager: '0xe519389F8c262d4301Fd2830196FB7D0021daf59',
    oTCSwapAssetManager: '0x49AeF2C4005Bf572665b09014A563B5b9E46Df21',
    curveAddLiquidityAssetManager: '0xD61210E756f7D71Cc4F74abF0747D65Ea9d7525b',
    curveFSNAddLiquidityAssetManager: '0xB8d6D6b01bFe81784BE46e5771eF017Fa3c906d8',
    curveFSNRemoveLiquidityAssetManager: '0x81f4f47aa3bBd154171C877b4d70F6C9EeCAb216',
    curveMPAddLiquidityAssetManager: '0x0C8542AB89c1C60D711B00F309f7EF63b5D9d6eb',
    curveMPRemoveLiquidityAssetManager: '0xB354ECF032e9e14442bE590D9Eaee37d2924B67A',
    curveMultiExchangeAssetManager: '0x221416CFa5A3CD92035E537ded1dD12d4d587c03',
    curveRemoveLiquidityAssetManager: '0x81F82957608f74441E085851cA5Cc091b23d17A2',
    curveSingleExchangeAssetManager: '0xE0a1556ef66873d965A2F4caD06F051646BE6707',
    generalDefiIntegrationAssetManager: '0x1c32f8818e38a50d37d1E98c72B9516a50985227',
    rocketPoolStakeAssetManager: '0xe8c3F27D20472e4f3C546A3f73C04B54DD72871d',
    sablierDynamicAssetManager: '0xd2983525E903Ef198d5dD0777712EB66680463bc',
    sablierLinearAssetManager: '0x72aC6A36de2f72BD39e9c782e9db0DCc41FEbfe2',
    stakingAssetManager: '0xCd9BC6cE45194398d12e27e1333D5e1d783104dD',
    uniswapLiquidityAssetManager: '0xfaA7b3a4b5c3f54a934a2e33D34C7bC099f96CCE',
    uniswapSwapAssetManager: '0x63ecE4C05B8fB272D16844E96702Ea2f26370982',

    uniswapNfpManager: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
    uniswapFactory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    sablierV2LockupLinear: '0xAFb979d9afAd1aD27C5eFf4E27226E3AB9e5dCC9',
    sablierV2LockupDynamic: '0x7CC7e125d83A581ff438608490Cc0f7bDff79127',
  },
  [ChainId.HARDHAT_ARBITRUM]: {
    nativeToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    offchainOracleAddress: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    verifierHub: '0x868542bE225690DCfE753e2e8977E3500677e749',
    curveAddLiquidityAssetManager: '0x0',
    curveFSNAddLiquidityAssetManager: '0x0',
    curveFSNRemoveLiquidityAssetManager: '0x0',
    curveMPAddLiquidityAssetManager: '0x0',
    curveMPRemoveLiquidityAssetManager: '0x0',
    curveMultiExchangeAssetManager: '0x0',
    curveRemoveLiquidityAssetManager: '0x0',
    curveSingleExchangeAssetManager: '0x0',
    darkpoolAssetManager: '0x920D80F5490c073A46076a61897A6e6dc88Bbf0D',
    uniswapLiquidityAssetManager: '0xF4844d9CD10c9f68e626310579996F7539A7c4F3',
    uniswapSwapAssetManager: '0xc538D528a9eE0A8137C99a15d1DE873e902C1115',
    stakingAssetManager: '0x0',
    aerodromeAddLiquidityAssetManager: '0x0',
    aerodromeRemoveLiquidityAssetManager: '0x0',
    aerodromeSwapAssetManager: '0x0',

    uniswapNfpManager: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
    uniswapFactory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    sablierV2LockupLinear: '0xFDD9d122B451F549f48c4942c6fa6646D849e8C1',
    sablierV2LockupDynamic: '0xf390cE6f54e4dc7C5A5f7f8689062b7591F7111d',
  },
  [ChainId.HARDHAT_BASE]: {
    nativeToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    offchainOracleAddress: '0xf224a25453D76A41c4427DD1C05369BC9f498444',
    curveAddLiquidityAssetManager: '0x0',
    curveFSNAddLiquidityAssetManager: '0x0',
    curveFSNRemoveLiquidityAssetManager: '0x0',
    curveMPAddLiquidityAssetManager: '0x0',
    curveMPRemoveLiquidityAssetManager: '0x0',
    curveMultiExchangeAssetManager: '0x0',
    curveRemoveLiquidityAssetManager: '0x0',
    curveSingleExchangeAssetManager: '0x0',
    stakingOperator: '0x8D81A3DCd17030cD5F23Ac7370e4Efb10D2b3cA4',
    verifierHub: '0xcC4c41415fc68B2fBf70102742A83cDe435e0Ca7',
    darkpoolAssetManager: '0xe1708FA6bb2844D5384613ef0846F9Bc1e8eC55E',
    nftAssetManager: '0xC1e0A9DB9eA830c52603798481045688c8AE99C2',
    oTCSwapAssetManager: '0xb185E9f6531BA9877741022C92CE858cDCc5760E',
    aerodromeAddLiquidityAssetManager: '0x3C1Cb427D20F15563aDa8C249E71db76d7183B6c',
    aerodromeRemoveLiquidityAssetManager: '0x0a17FabeA4633ce714F1Fa4a2dcA62C3bAc4758d',
    aerodromeSwapAssetManager: '0x95775fD3Afb1F4072794CA4ddA27F2444BCf8Ac3',
    generalDefiIntegrationAssetManager: '0xCBBe2A5c3A22BE749D5DDF24e9534f98951983e2',
    sablierDynamicAssetManager: '0x2c8ED11fd7A058096F2e5828799c68BE88744E2F',
    sablierLinearAssetManager: '0x4593ed9CbE6003e687e5e77368534bb04b162503',
    stakingAssetManager: '0xdF46e54aAadC1d55198A4a8b4674D7a4c927097A',
    uniswapLiquidityAssetManager: '0x742489F22807ebB4C36ca6cD95c3e1C044B7B6c8',
    uniswapSwapAssetManager: '0x286B8DecD5ED79c962b2d8F4346CD97FF0E2C352',

    uniswapNfpManager: '0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1',
    uniswapFactory: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD',
    sablierV2LockupLinear: '0x4CB16D4153123A74Bc724d161050959754f378D8',
    sablierV2LockupDynamic: '0xF9E9eD67DD2Fab3b3ca024A2d66Fcf0764d36742',
  }
}