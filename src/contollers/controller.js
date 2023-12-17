const {
  getPgDarkPoolWithdrawInputError,
  //getMiningRewardInputError,
  //getMiningWithdrawInputError
} = require('../modules/validator')
const { postJob } = require('../queue')
const { jobType } = require('../constants')

async function pgDarkPoolWithdraw(req, res) {
  const inputError = getPgDarkPoolWithdrawInputError(req.body)
  if (inputError) {
    console.log('Invalid input:', inputError)
    return res.status(400).json({ error: inputError })
  }

  const id = await postJob({
    type: jobType.PG_DARKPOOL_WITHDRAW,
    request: req.body,
  })
  return res.json({ id })
}

/*async function miningReward(req, res) {
  const inputError = getMiningRewardInputError(req.body)
  if (inputError) {
    console.log('Invalid input:', inputError)
    return res.status(400).json({ error: inputError })
  }

  const id = await postJob({
    type: jobType.MINING_REWARD,
    request: req.body,
  })
  return res.json({ id })
}

async function miningWithdraw(req, res) {
  const inputError = getMiningWithdrawInputError(req.body)
  if (inputError) {
    console.log('Invalid input:', inputError)
    return res.status(400).json({ error: inputError })
  }

  const id = await postJob({
    type: jobType.MINING_WITHDRAW,
    request: req.body,
  })
  return res.json({ id })
}*/

module.exports = {
  pgDarkPoolWithdraw,
  //miningReward,
  //miningWithdraw,
}
