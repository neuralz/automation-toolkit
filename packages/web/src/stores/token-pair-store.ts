import { Dashboard } from 'api/api';
import { observable } from 'mobx';

export class TokenPairStore {
  @observable public tokenPairs: Dashboard.Api.ITokenPair[];

  public async initialize() {
    this.tokenPairs = await new Dashboard.Api.TokenPairsService().get();
  }

  public getTokenPairsBySymbols(params: { baseTokenSymbol: string; quoteTokenSymbol: string }) {
    const { baseTokenSymbol, quoteTokenSymbol } = params;
    return this.tokenPairs.find(tp => tp.tokenA.symbol === baseTokenSymbol && tp.tokenB.symbol === quoteTokenSymbol) as Dashboard.Api.ITokenPair;
  }
}

export const tokenPairStore = new TokenPairStore();
