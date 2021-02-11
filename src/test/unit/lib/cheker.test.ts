import { Checker } from '../../../lib/Checker'

describe('Checker', function () {
  let checker: Checker

  beforeAll(function () {
    checker = new Checker(null)
  })

  test('createQuery when timestamp is null', async function () {
    const res = checker.createQuery(null)
    expect(res).toMatch(`{
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
     }`)
  })

  test('createQuery when timestamp is a number', async function () {
    const timestamp = 435453452
    const res = checker.createQuery(timestamp)
    expect(res).toMatch(`{
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
     }`)
  })
})
