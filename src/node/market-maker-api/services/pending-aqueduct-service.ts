import { AqueductServer } from '../swagger/aqueduct-server';

const sleep = (ms: number) => {
  return new Promise(r => setTimeout(() => r(), ms));
};

export class PendingAqueductService {
  constructor(
    private readonly walletService: AqueductServer.Api.IWalletService = new AqueductServer.Api.WalletService()
  ) { }

  public async waitForAqueductServer() {
    while (true) {
      try {
        await this.walletService.getNetwork();
        console.log('aqueduct remote ready');
        return;
      } catch (err) {
        console.error('waiting for aqueduct remote to start...');
        await sleep(5000);
      }
    }
  }
}
