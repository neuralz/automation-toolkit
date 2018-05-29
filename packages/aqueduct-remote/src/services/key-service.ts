import * as fs from 'fs';
import * as path from 'path';
import { ServerError } from '../server-error';
// tslint:disable-next-line
const wallet: IEthereumJsWallet = require('ethereumjs-wallet');

interface IEthereumJsWallet {
  fromPrivateKey(buffer: Buffer): IWalletInstance;
  fromV3(keyfile: IKeyFile, passphrase: string): IWalletInstance;
}

interface IWalletInstance {
  toV3(passphrase: string): IKeyFile;
  getPrivateKeyString(): string;
  getAddressString(): string;
}

export interface ICipherparams {
  iv: string;
}

export interface IKdfparams {
  dklen: number;
  salt: string;
  n: number;
  r: number;
  p: number;
}

export interface ICrypto {
  ciphertext: string;
  cipherparams: ICipherparams;
  cipher: string;
  kdf: string;
  kdfparams: IKdfparams;
  mac: string;
}

export interface IKeyFile {
  version: number;
  id: string;
  address: string;
  crypto: ICrypto;
}

export interface IImportAccountRequest {
  key: string;
  passphrase: string;
}

export interface IUnlockAccountRequest {
  passphrase: string;
}

export interface IConfigurationStatus {
  unlocked: boolean;
  imported: boolean;
}

const keyFilePath = path.join(__dirname, 'store.json');
let instance: IWalletInstance | undefined = undefined;

export class KeyService {
  public importAccount({ passphrase, key }: IImportAccountRequest) {
    let account: string | undefined = undefined;
    try {
      account = this.getAccount();
      // tslint:disable-next-line:no-empty
    } catch { }
    if (account) {
      throw new ServerError(`cannot import account, another account already active. remove existing account first.`, 400);
    }

    instance = wallet.fromPrivateKey(Buffer.from(key, 'hex'));
    const v3 = instance.toV3(passphrase);

    fs.writeFileSync(keyFilePath, JSON.stringify(v3));

    this.unlockAccount({ passphrase });
  }

  public unlockAccount({ passphrase }: IUnlockAccountRequest) {
    let keyFile: IKeyFile;
    try {
      keyFile = this.readKeyFile();
    } catch (err) {
      throw new ServerError(`no account has been imported`, 400);
    }

    try {
      instance = wallet.fromV3(keyFile, passphrase);
    } catch (err) {
      throw new ServerError('incorrect passphrase', 400);
    }
  }

  public getAccount() {
    try {
      this.readKeyFile();
    } catch {
      throw new ServerError('account not configured', 500);
    }

    if (!instance) {
      throw new ServerError(`account not unlocked`);
    }

    return instance.getAddressString();
  }

  public getPrivateKey() {
    if (!instance) { throw new ServerError('account not unlocked'); }
    return instance.getPrivateKeyString();
  }

  public getConfigurationStatus(): IConfigurationStatus {
    return {
      imported: this.isImported(),
      unlocked: this.isUnlocked()
    };
  }

  private readKeyFile() {
    const rawContent = fs.readFileSync(keyFilePath).toString();
    return JSON.parse(rawContent) as IKeyFile;
  }

  private isUnlocked() {
    return typeof instance !== 'undefined';
  }

  private isImported() {
    try {
      this.readKeyFile();
      return true;
    } catch {
      return false;
    }
  }
}
