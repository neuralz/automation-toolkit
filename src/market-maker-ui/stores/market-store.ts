import { observable } from 'mobx';
import { Dashboard } from '../api/api';

export class MarketStore {
  @observable public markets: Dashboard.Api.IStoredMarket[];
  @observable public isCreatingMarket = false;

  public async initialize() {
    this.markets = await new Dashboard.Api.MarketsService().get();
  }
}

export const marketStore = new MarketStore();
