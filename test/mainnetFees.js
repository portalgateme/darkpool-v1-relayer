/* global BigInt */
const assert = require('assert').strict
const fs = require('fs')
const path = require('path')
const vm = require('vm')
const { toBN, toWei } = require('web3-utils')
const constants = require('../src/config/constants')

// Load the real modules with isolated RPC/Redis dependencies; never start external services.
function loadModule(filename, dependencies) {
  const context = {
    module: { exports: {} },
    console: { log() {}, error() {} },
    process: { env: {} },
    require(name) {
      if (name.startsWith('./worker/')) return new Proxy({}, { get: () => dependencies.Worker })
      if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`)
      return dependencies[name]
    },
  }
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', filename), 'utf8'), context, { filename })
  return context
}

function loadFees(netId, oracle) {
  return loadModule('src/modules/fees.js', {
    '../utils': { toBN, toWei, RelayerError: Error },
    '../config/config': { netId, maxPriorityFee: 3 },
    '../config/constants': constants,
    './priceOracle': {},
    './web3': () => oracle,
    'gas-price-oracle': { GasPriceOracle: class {} },
  }).module.exports
}

function history() {
  return { baseFeePerGas: ['100000000', '120000000'], reward: [[1], [5], [3], [4], [2]] }
}

describe('Mainnet fee sampling', () => {
  it('samples five blocks from the sending RPC and reuses that snapshot for sending', async () => {
    let calls = 0
    const fees = loadFees(1, { eth: {} })
    const web3 = {
      eth: {
        getFeeHistory: (...args) => {
          assert.deepEqual(JSON.parse(JSON.stringify(args)), [5, 'latest', [75]])
          calls++
          return Promise.resolve(history())
        },
      },
    }
    const params = await fees.getFeeParams(web3)
    assert.equal(params.priorityFee.toString(), '3')
    const tx = await fees.getTxGasParams(web3, params, 1000)
    assert.equal(toBN(tx.maxPriorityFeePerGas).toString(), '3')
    assert.equal(toBN(tx.maxFeePerGas).toString(), '240000003')
    assert.equal(calls, 1)
  })

  it('can prepare a mainnet transaction when feeHistory is unsupported', async () => {
    const fees = loadFees(1, { eth: {} })
    let calls = 0
    const web3 = {
      eth: {
        getFeeHistory: () => {
          calls++
          return Promise.reject(new Error('Method not found'))
        },
        getBlock: () => Promise.resolve({ baseFeePerGas: '120000000' }),
      },
    }
    const params = await fees.getFeeParams(web3)
    const tx = await fees.getTxGasParams(web3, params, 1000)
    assert.equal(toBN(tx.maxPriorityFeePerGas).toString(), '3000000000')
    assert.equal(calls, 1)
  })

  it('retains the priority fee and transaction price caps', async () => {
    const fees = loadFees(1, { eth: {} })
    const web3 = {
      eth: {
        getFeeHistory: () =>
          Promise.resolve({
            ...history(),
            reward: Array(5).fill(['4000000000']),
          }),
      },
    }
    const params = await fees.getFeeParams(web3)
    assert.equal(params.priorityFee.toString(), '3000000000')
    const tx = await fees.getTxGasParams(web3, params, 2)
    assert.equal(toBN(tx.maxFeePerGas).toString(), '2000000000')
    assert.equal(toBN(tx.maxPriorityFeePerGas).toString(), '2000000000')
  })

  it('keeps the 20-block oracle sampling and sending-chain lookup on Base', async () => {
    const fees = loadFees(8453, {
      eth: {
        getFeeHistory: blocks => {
          assert.equal(blocks, 20)
          return Promise.resolve(history())
        },
      },
    })
    const web3 = {
      eth: {
        getFeeHistory: blocks => {
          assert.equal(blocks, 1)
          return Promise.resolve({ baseFeePerGas: ['20', '30'] })
        },
      },
    }
    const params = await fees.getFeeParams(web3)
    const tx = await fees.getTxGasParams(web3, params, 1000)
    assert.equal(toBN(tx.maxFeePerGas).toString(), '63')
  })
})

async function workerHarness({ initial = [1000000], final = [1050000], netId = 1, gasLimit = 6000000 } = {}) {
  const built = []
  const estimates = []
  let initialCalls = 0
  let ready
  const started = new Promise(resolve => {
    ready = resolve
  })
  const next = values => {
    const value = values.shift()
    return value instanceof Error ? Promise.reject(value) : Promise.resolve(value)
  }
  const web3 = {
    eth: {
      getFeeHistory: () => Promise.resolve(history()),
      estimateGas: tx => {
        estimates.push(tx)
        return next(final)
      },
    },
  }
  class Worker {
    estimateGas() {
      initialCalls++
      return next(initial)
    }
    getTxObj(web3, data, gasFee) {
      const tx = { to: 'contract', data: '0x' + gasFee.toString(16), value: '0x0', gasLimit }
      built.push({ gasFee, tx })
      return Promise.resolve(tx)
    }
  }
  const fees = loadFees(netId, web3)
  const context = loadModule('src/worker.js', {
    Worker,
    './queue': { queue: { process: ready } },
    './utils': {
      RelayerError: Error,
      logRelayerError: (redis, error) => {
        throw error
      },
    },
    './config/constants': constants,
    './config/config': { netId, gasUnitFallback: { [constants.jobType.PG_DARKPOOL_WITHDRAW]: 800000 } },
    'tx-manager': {
      TxManager: class {
        constructor() {
          this.config = {}
          this.address = 'actual-signer'
        }
      },
    },
    './modules/redis': { redis: { del: () => Promise.resolve() } },
    './modules/web3': () => web3,
    './modules/verifier': { zkProofVerifier: () => Promise.resolve(true) },
    './modules/fees': fees,
  })
  await started
  return {
    run: () =>
      context.getTxObject({
        data: { type: constants.jobType.PG_DARKPOOL_WITHDRAW, relayer: 'request-address' },
      }),
    built,
    estimates,
    initialCalls: () => initialCalls,
  }
}

describe('Mainnet final calldata gas validation', () => {
  it('checks the final calldata, fee fields and gas limit with the actual signer', async () => {
    const h = await workerHarness()
    const tx = await h.run()
    assert.equal(h.built.length, 1)
    assert.equal(h.estimates[0].data, tx.data)
    assert.equal(h.estimates[0].from, 'actual-signer')
    assert.equal(h.estimates[0].gas, tx.gasLimit)
    assert.equal(h.estimates[0].value, tx.value)
    assert.equal(h.estimates[0].maxPriorityFeePerGas, tx.maxPriorityFeePerGas)
    assert.equal(h.estimates[0].gasLimit, undefined)
  })

  it('recalculates the refund once and validates the rebuilt calldata', async () => {
    const h = await workerHarness({ final: [1500000, 1550000] })
    const tx = await h.run()
    assert.equal(h.built.length, 2)
    assert(h.built[1].gasFee > h.built[0].gasFee)
    assert.equal(h.built[1].gasFee * BigInt(2), h.built[0].gasFee * BigInt(3))
    assert.notEqual(h.estimates[0].data, h.estimates[1].data)
    assert.equal(tx.data, h.estimates[1].data)
  })

  it('rejects estimates still outside the gas-unit buffer after recalculation', async () => {
    const h = await workerHarness({ final: [1500000, 1800000] })
    await assert.rejects(h.run(), /exceeds fee buffer/)
    assert.equal(h.built.length, 2)
  })

  it('rejects a final estimate beyond the configured transaction gas limit', async () => {
    const h = await workerHarness({ final: [6100000] })
    await assert.rejects(h.run(), /exceeds transaction gas limit/)
  })

  it('retries the initial estimate once without using the old fallback', async () => {
    const h = await workerHarness({ initial: [new Error('RPC timeout'), 4000000], final: [4100000] })
    await h.run()
    assert.equal(h.initialCalls(), 2)
    assert.equal(h.built.length, 1)
  })

  it('stops when both initial estimates fail', async () => {
    const h = await workerHarness({ initial: [new Error('RPC timeout'), new Error('RPC timeout')] })
    await assert.rejects(h.run(), /RPC timeout/)
    assert.equal(h.built.length, 0)
  })

  it('stops when final calldata reverts instead of sending with a fallback', async () => {
    const h = await workerHarness({ final: [new Error('execution reverted')] })
    await assert.rejects(h.run(), /execution reverted/)
  })

  it('keeps the existing fallback and transaction flow on other chains', async () => {
    const h = await workerHarness({ netId: 8453, initial: [new Error('RPC timeout')] })
    await h.run()
    assert.equal(h.initialCalls(), 1)
    assert.equal(h.built.length, 1)
    assert.equal(h.estimates.length, 0)
  })
})
