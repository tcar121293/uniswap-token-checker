
export interface IUniswapCheckNewTokenPair{
    createdAtTimestamp: number,
    id: string,
    token0: {
        derivedETH: string,
        id: string,
        name: string,
        symbol: string
    },
    token1: {
        derivedETH: number,
        id: string,
        name: string,
        symbol: string
    }
}
