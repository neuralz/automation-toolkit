import { Body, Delete, Get, Post, Query, Route, Tags } from 'tsoa';
import { config } from '../config';
import { ServerError } from '../server-error';
import { IConfigurationStatus, IImportAccountRequest, IUnlockAccountRequest, KeyService } from '../services/key-service';
import { web3service } from '../services/web3-service';
import { ZeroExService } from '../services/zero-ex-service';

export interface INetwork {
  id: number;
  chain: string;
}

@Route('wallet')
export class WalletController {
  @Get('account')
  @Tags('Wallet')
  public async getAccount(): Promise<string> {
    const account = new KeyService().getAccount();
    if (!account) {
      throw new ServerError(`no account configured`);
    }

    return account;
  }

  @Post('import')
  @Tags('Wallet')
  public importAccount(@Body() request: IImportAccountRequest) {
    new KeyService().importAccount(request);
  }

  @Delete('remove')
  @Tags('Wallet')
  public removeAccount() {
    new KeyService().removeAccount();
  }

  @Post('unlock')
  @Tags('Wallet')
  public unlockAccount(@Body() request: IUnlockAccountRequest) {
    new KeyService().unlockAccount(request);
  }

  @Post('lock')
  @Tags('Wallet')
  public lockAccount() {
    new KeyService().lockAccount();
  }

  @Get('configuration_status')
  @Tags('Wallet')
  public getConfigurationStatus(): IConfigurationStatus {
    return new KeyService().getConfigurationStatus();
  }

  @Get('balance')
  @Tags('Wallet')
  public async getBalance(@Query() tokenAddress: string): Promise<string> {
    return await new ZeroExService().getTokenBalance(tokenAddress);
  }

  @Get('allowance')
  @Tags('Wallet')
  public async getAllowance(@Query() tokenAddress: string): Promise<string> {
    return await new ZeroExService().getTokenAllowance(tokenAddress);
  }

  @Post('unlimited_allowance')
  @Tags('Wallet')
  public async setUnlimitedAllowance(@Query() tokenAddress: string) {
    await new ZeroExService().setTokenAllowance(tokenAddress);
  }

  @Get('eth_balance')
  @Tags('Wallet')
  public async getEthBalance(): Promise<string> {
    return await web3service.getEthBalance();
  }

  @Get('network')
  @Tags('Wallet')
  public getNetwork(): INetwork {
    return {
      id: config.networkId,
      chain: config.chain
    };
  }
}
