import { Body, Delete, Get, Patch, Post, Route, Tags } from 'tsoa';
import { config } from '../config';
import { IMarket, IStoredMarket, marketRepository } from '../db/market-repository';
import { IMarketStatsHistory } from '../db/market-stats-history-repository';
import { IMarketStats, ISetCancellationModeRequest, IStartMarketRequest, IStopMarketRequest, IValidateStopResult } from '../services/market-service';
import { MarketService } from '../services/market-service';

@Route('markets')
export class MarketsController {
  private readonly marketService = new MarketService();

  @Get()
  @Tags('Markets')
  public async get(): Promise<IStoredMarket[]> {
    return await marketRepository.find({});
  }

  @Delete('{marketId}')
  @Tags('Markets')
  public async deleteMarket(marketId: string) {
    await this.marketService.deleteMarket(marketId);
  }

  @Patch('set-cancellation-mode')
  @Tags('Markets')
  public async setCancellationMode(@Body() request: ISetCancellationModeRequest) {
    await this.marketService.setCancellationMode(request);
  }

  @Post()
  @Tags('Markets')
  public async create(@Body() request: IMarket): Promise<IStoredMarket> {
    return await this.marketService.create(request);
  }

  @Post('start')
  @Tags('Markets')
  public async startMarket(@Body() request: IStartMarketRequest) {
    return await this.marketService.start(request);
  }

  @Post('attempt_stop/{id}')
  @Tags('Markets')
  public async validateStop(id: string): Promise<IValidateStopResult> {
    return await this.marketService.validateStop(id);
  }

  @Post('stop')
  @Tags('Markets')
  public async stopMarket(@Body() request: IStopMarketRequest) {
    return await this.marketService.stop(request);
  }

  @Get('network_id')
  @Tags('Markets')
  public async getNetworkId() {
    return config.networkId;
  }

  @Get('latest_stats/{marketId}')
  @Tags('Markets')
  public async getLatestStats(marketId: string): Promise<IMarketStats> {
    return await this.marketService.getLatestStats(marketId);
  }

  @Get('stats/{marketId}')
  @Tags('Markets')
  public async getStats(marketId: string): Promise<IMarketStatsHistory[]> {
    return await this.marketService.getStats(marketId);
  }
}
