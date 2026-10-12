/* global BigInt */
const assert = require('assert').strict
const fs = require('fs')
const path = require('path')
const vm = require('vm')

// Load the worker with stubbed contracts and config; never call an RPC.
function loadWorker() {
  const calls = []
  const contract = {
    _address: 'asset-manager',
    methods: {
      claimStream: (proof, args) => {
        calls.push(args)
        return { estimateGas: () => Promise.resolve(4000000), encodeABI: () => '0x' }
      },
    },
  }
  const dependencies = {
    '../../abis/pgDarkPoolSablierDynamicAssetManager.json': { abi: [] },
    '../../abis/pgDarkPoolSablierLinearAssetManager.json': { abi: [] },
    '../utils': { RelayerError: Error, isAddressEquals: (a, b) => a.toLowerCase() === b.toLowerCase() },
    '../modules/fees': {},
    '../config/config': {
      pgDarkPoolSablierLinearAssetManager: 'linear-manager',
      pgDarkPoolSablierDynamicAssetManager: 'dynamic-manager',
      sablierV2LockupLinear: '0xLinear',
      sablierV2LockupDynamic: '0xDynamic',
      gasLimits: { DEFI_WITH_EXTRA: 20000000 },
    },
    './baseWorker': { BaseWorker: class {} },
    '../defi/sablierService': {},
  }
  const context = {
    module: { exports: {} },
    require(name) {
      if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`)
      return dependencies[name]
    },
  }
  const filename = 'src/worker/sablierClaimWorker.js'
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', filename), 'utf8'), context, { filename })
  const worker = new context.module.exports.SablierClaimWorker()
  worker.getContract = () => contract
  return { worker, calls }
}

describe('Sablier claim gas estimate', () => {
  it('estimates with a 1 unit refund instead of a gas limit used as a token amount', async () => {
    const { worker, calls } = loadWorker()
    // 2.73 USDC: below the 20 USDC that DEFI_WITH_EXTRA (20,000,000) means as a 6-decimal token amount
    const gas = await worker.estimateGas({}, { stream: '0xLinear', amountOut: '2731481', relayer: 'relayer' })
    assert.equal(gas, 4000000)
    assert.equal(calls.length, 1)
    assert.equal(calls[0].gasRefund, 1)
    assert(BigInt(calls[0].gasRefund) <= BigInt(calls[0].amountOut))
  })
})
