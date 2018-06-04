import { observable } from 'mobx';
import { Dashboard } from '../api/api';

export class AccountStore {
  @observable public account?: string;
  @observable public status?: Dashboard.Api.IConfigurationStatus;

  public async initialize() {
    try {
      this.account = undefined;
      this.account = await new Dashboard.Api.AccountsService().getAccount();
      // tslint:disable-next-line:no-empty
    } catch { }

    try {
      this.status = undefined;
      this.status = await new Dashboard.Api.AccountsService().getConfigurationStatus();
      // tslint:disable-next-line:no-empty
    } catch { }
  }
}

export const accountStore = new AccountStore();
