import { PrivateKeyWalletSubprovider } from '@0xproject/subproviders';
import * as Web3 from 'web3';
// tslint:disable-next-line:no-require-imports
import ProviderEngine = require('web3-provider-engine');
// tslint:disable-next-line:no-require-imports
import RpcSubprovider = require('web3-provider-engine/subproviders/rpc');
import { config } from '../config';
import { KeyService } from './key-service';

export class Web3Service {
  private web3?: Web3;

  public static getInstance() {
    return new Web3Service();
  }

  protected constructor() { }

  public async getEthBalance() {
    const account = new KeyService().getAccount();
    return await this._getEthBalance(account);
  }

  public getWeb3() {
    if (this.web3) {
      return this.web3;
    }

    const provider = new ProviderEngine();

    const privateKey = new KeyService().getPrivateKey();
    provider.addProvider(new PrivateKeyWalletSubprovider(privateKey.substring(2, privateKey.length)));
    provider.addProvider(new RpcSubprovider({
      rpcUrl: config.nodeUrl
    }));
    provider.start();

    this.web3 = new Web3(provider);
    return this.web3;
  }

  private async _getEthBalance(account: string) {
    return new Promise<string>((resolve, reject) => {
      this.getWeb3().eth.getBalance(account, (err, balance) => {
        if (err) { return reject(err); }
        resolve(balance.toString());
      });
    });
  }
}

export const web3service = Web3Service.getInstance();
