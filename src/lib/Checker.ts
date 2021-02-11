
import axios from 'axios'

import { Token } from '../db'
import { IUniswapCheckNewTokenPair } from '../interfaces/IUniswap'
import { UniswapError } from '../errors/UniswapError'

export class Checker {
    private lastTimestamp: number | null

    constructor (timestamp: number | null) {
      this.lastTimestamp = timestamp
    }

  public checkNewToken = async () => {
    const query = this.createQuery(this.lastTimestamp)
    // should be logger.debug
    console.log(`Sending request to uniswap with query ${query}`)
    let data
    try {
      data = await axios.post(process.env.UNISWAP_API_URL ||
        'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2', {
        query
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } catch (err) {
      throw new UniswapError(err.message)
    }

    if (data && data.data && data.data.data && data.data.data.pairs &&
        data.data.data.pairs.length) {
      // logger.trace
      console.log(`Recieved data ${data.data.data.pairs}`)
      const { newTokens, currTimestamp } = this.processResult(data.data.data.pairs)

      // logger.debug
      console.log(`data to insert ${newTokens}`)
      await Token.bulkCreate(newTokens)
      this.lastTimestamp = currTimestamp

      // logger.debug
      console.log(`New timestamp: ${this.lastTimestamp}`)
    } else {
      console.log('No new tokens on uniswap exchange')
    }
  }

public createQuery = (timestamp: number | null): string => {
  if (timestamp) {
    return `{
        pairs(orderBy: createdAtTimestamp, orderDirection: desc, where: {
            createdAtTimestamp_gt: ${timestamp}
        }) {
          id
          token0 {
            id
            symbol
            name
            derivedETH
          }
          token1 {
            id
            symbol
            name
            derivedETH
          }
         createdAtTimestamp
        }
     }`
  } else {
    return `{
        pairs(orderBy: createdAtTimestamp, orderDirection: desc, first: 1) {
          id
          token0 {
            id
            symbol
            name
            derivedETH
          }
          token1 {
            id
            symbol
            name
            derivedETH
          }
         createdAtTimestamp
        }
     }`
  }
}

private processResult (pairs: IUniswapCheckNewTokenPair[]) {
  const newTokens: {timestamp: number, name: string}[] = []
  let currTimestamp: number | null = null
  for (const pair of pairs) {
    currTimestamp = pair.createdAtTimestamp
    newTokens.push({
      timestamp: pair.createdAtTimestamp,
      name: pair.token0.name
    })

    newTokens.push({
      timestamp: pair.createdAtTimestamp,
      name: pair.token1.name
    })
    currTimestamp = pair.createdAtTimestamp
  }
  return { currTimestamp, newTokens }
}
}
