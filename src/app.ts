
import { Checker } from './lib/Checker'
import { db, Token } from './db'
import { UniswapError } from './errors/UniswapError'
db
  .sync()
  .then(() => {
    main()
  })

async function main () {
  const token = await Token.findOne({
    order: [['timestamp', 'DESC']]
  })

  const timestamp = token ? token.timestamp : null

  try {
    const checker = new Checker(timestamp)
    setInterval(checker.checkNewToken, Number(process.env.TIME_INTERVAL) || 3000)
  } catch (err) {
    if (err instanceof UniswapError) {
      process.exit(1)
    }
    console.error(err)
  }
}
