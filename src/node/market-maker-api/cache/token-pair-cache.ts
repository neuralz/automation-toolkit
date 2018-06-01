import { Aqueduct } from 'aqueduct';

export interface ITokenPairCache {
  getTokenPairs(networkId: number): Promise<Aqueduct.Api.ITokenPair[]>;
  getTokenBySymbol(params: {
    networkId: number;
    symbol: string;
  }): Promise<Aqueduct.Api.IToken>;
  getTokenPair(params: {
    networkId: number;
    baseSymbol: string;
    quoteSymbol: string;
  }): Promise<Aqueduct.Api.ITokenPair>;
}

export class TokenPairCache implements ITokenPairCache {
  private tokenPairsMap: { [networkId: number]: Promise<Aqueduct.Api.ITokenPair[]> | undefined } = {};

  public async getTokenPairs(networkId: number) {
    if (this.tokenPairsMap[networkId]) {
      return await this.tokenPairsMap[networkId] as Aqueduct.Api.ITokenPair[];
    }

    try {
      const tokenPairs = this.tokenPairsMap[networkId] = new Aqueduct.Api.TokenPairsService().get({ networkId });
      return await tokenPairs;
    } catch (err) {
      console.error('failed to get token pairs...');
      throw err;
    }
  }

  public async getTokenBySymbol(params: { networkId: number; symbol: string; }) {
    const symbol = params.symbol.toUpperCase();
    const tokenPairs = await this.getTokenPairs(params.networkId);

    for (let i = 0; i < tokenPairs.length; i++) {
      const tokenPair = tokenPairs[i];
      if (tokenPair.tokenA.symbol === symbol) { return tokenPair.tokenA; }
      if (tokenPair.tokenB.symbol === symbol) { return tokenPair.tokenB; }
    }

    throw new Error(`token ${symbol} not found or not supported`);
  }

  public async getTokenPair(params: { networkId: number; baseSymbol: string; quoteSymbol: string }) {
    const { networkId, baseSymbol, quoteSymbol } = params;
    const tokenPairs = await this.getTokenPairs(networkId);

    const tokenPair = tokenPairs.find(tp => tp.tokenA.symbol === baseSymbol.toUpperCase()
      && tp.tokenB.symbol === quoteSymbol.toUpperCase());
    if (!tokenPair) {
      throw new Error(`token pair ${baseSymbol}/${quoteSymbol} not found or not supported`);
    }

    return tokenPair;
  }
}

export const tokenPairCache = new TokenPairCache();
