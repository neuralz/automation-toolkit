import { Body, Get, Post, Query, Route, Tags } from 'tsoa';
import { config } from '../config';
import { IImportAccountRequest, ParityService } from '../services/parity-service';
import { INodeHealth, IUnlockAccountParams, Web3Service } from '../services/web3-service';
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
    return await new Web3Service().getAccount();
  }

  @Post('import')
  @Tags('Wallet')
  public async importAccount(@Body() request: IImportAccountRequest) {
    return await new ParityService().importAccount(request);
  }

  @Post('unlock')
  @Tags('Wallet')
  public async unlockAccount(@Body() request: IUnlockAccountParams) {
    const account = await this.getAccount();
    return await new ParityService().unlockAccount(account, request.passphrase);
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
    return await new Web3Service().getEthBalance();
  }

  @Get('node_health')
  @Tags('Wallet')
  public async getNodeHealth(): Promise<INodeHealth> {
    return await new Web3Service().getParityNodeHealth();
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
