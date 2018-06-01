import { PrivateKeyWalletSubprovider } from '@0xproject/subproviders';
import * as Web3 from 'web3';
import ProviderEngine from 'web3-provider-engine';
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc';
import { config } from '../config';
import { KeyService } from './key-service';

export class Web3Service {
  private web3map: { [nodeUrl: string]: Web3 | undefined } = {};

  public static getInstance() {
    return new Web3Service();
  }

  protected constructor() { }

  public async getEthBalance() {
    const account = new KeyService().getAccount();
    return await this._getEthBalance(account);
  }

  public getWeb3() {
    const cachedWeb3 = this.web3map[config.nodeUrl];
    if (cachedWeb3) {
      return cachedWeb3;
    }

    const provider = new ProviderEngine();

    const privateKey = new KeyService().getPrivateKey();
    provider.addProvider(new PrivateKeyWalletSubprovider(privateKey.substring(2, privateKey.length)));
    provider.addProvider(new RpcSubprovider({
      rpcUrl: config.nodeUrl
    }));
    provider.start();

    const web3 = this.web3map[config.nodeUrl] = new Web3(provider);
    return web3;
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

export let web3service = Web3Service.getInstance();
