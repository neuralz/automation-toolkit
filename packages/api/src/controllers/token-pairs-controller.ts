import { Get, Route, Tags } from 'tsoa';
import { ITokenTicker, tickerDataCache } from '../cache/ticker-data-cache';
import { tokenPairCache } from '../cache/token-pair-cache';
import { config } from '../config';
import { ITokenPair } from '../db/market-repository';
import { ServerError } from '../errors/server-error';

@Route('token-pairs')
export class TokenPairsController {
  @Get()
  @Tags('TokenPairs')
  public async get(): Promise<ITokenPair[]> {
    return await tokenPairCache.getTokenPairs(config.networkId);
  }

  @Get('tickers')
  @Tags('TokenPairs')
  public getTickers(): ITokenTicker[] {
    if (!tickerDataCache.tickers) {
      throw new ServerError('tickers not initialized', 500);
    }

    return tickerDataCache.tickers;
  }
}
