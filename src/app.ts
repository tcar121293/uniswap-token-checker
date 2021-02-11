
import dotenv = require('dotenv')
dotenv.config()

// eslint-disable-next-line
import { Checker } from './lib/Checker'
// eslint-disable-next-line
import { db, Token } from './db'
// eslint-disable-next-line
import { UniswapError } from './errors/UniswapError'

db
  .sync({ force: process.env.DROP_DB || false })
  .then(() => {
    main()
  })

async function main () {
  // find last token
  const token = await Token.findOne({
    order: [['timestamp', 'DESC']]
  })

  const timestamp = token ? token.timestamp : null

  try {
    const checker = new Checker(timestamp)
    // periodically check for new tokens
    setInterval(checker.checkNewToken, Number(process.env.TIME_INTERVAL) || 3000)
  } catch (err) {
    if (err instanceof UniswapError) {
      console.error(err)
      process.exit(1)
    }
    console.error(err)
  }
}
