import { ZeroEx } from '0x.js';
import { Transaction } from '@0xproject/types';
import { config } from '../config';
import { ServerError } from '../server-error';
import { KeyService } from './key-service';
import { web3service } from './web3-service';

export interface ICancelReceipt {
  gasCost: string;
  status: number;
}

export class ZeroExService {
  private readonly zeroEx: ZeroEx;
  private readonly web3 = web3service.getWeb3();

  constructor() {
    this.zeroEx = new ZeroEx(this.web3.currentProvider, {
      networkId: config.networkId
    });
  }

  public async getTokenBalance(tokenAddress: string) {
    const account = new KeyService().getAccount();
    const balance = await this.zeroEx.token.getBalanceAsync(tokenAddress, account);
    return balance.toString();
  }

  public async getTokenAllowance(tokenAddress: string) {
    const account = new KeyService().getAccount();
    const allowance = await this.zeroEx.token.getProxyAllowanceAsync(tokenAddress, account);
    return allowance.toString();
  }

  public async setTokenAllowance(tokenAddress: string) {
    try {
      console.log(`setting allowance for ${tokenAddress}`);
      const account = new KeyService().getAccount();
      const txHash = await this.zeroEx.token.setUnlimitedProxyAllowanceAsync(tokenAddress, account);
      console.log(`set allowance @ ${txHash}`);
      await this.zeroEx.awaitTransactionMinedAsync(txHash);
    } catch (err) {
      throw new ServerError(`error setting token allowance: ${err.message}`, 500);
    }
  }

  public async getCancelReceipt(txHash: string): Promise<ICancelReceipt> {
    try {
      const receipt = await this.zeroEx.awaitTransactionMinedAsync(txHash, 5000);
      const tx = await this.getTx(txHash);

      return {
        gasCost: tx.gasPrice.times(tx.gas).toString(),
        status: receipt.status
      } as ICancelReceipt;
    } catch (err) {
      throw new ServerError(`cancel ${txHash} not yet mined`);
    }
  }

  private async getTx(txHash: string) {
    return new Promise<Transaction>((resolve, reject) => {
      this.web3.eth.getTransaction(txHash, (err, tx) => {
        if (err) { return reject(err); }
        resolve(tx);
      });
    });
  }
}
