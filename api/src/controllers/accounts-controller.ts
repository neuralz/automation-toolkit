import { Body, Get, Post, Query, Route, Tags } from 'tsoa';
import { AqueductRemote } from '../swagger/aqueduct-remote';

export interface IImportAccountRequest {
  passphrase: string;
  key: string;
}

export interface ITokenStats {
  balance: string;
  allowance: string;
}

export interface ISetAllowanceRequest {
  passphrase: string;
  tokenAddress: string;
}

@Route('accounts')
export class AccountsController {
  @Get()
  @Tags('Accounts')
  public async getAccount(): Promise<string> {
    return await new AqueductRemote.Api.WalletService().getAccount();
  }

  @Post('import')
  @Tags('Accounts')
  public async importAccount(@Body() request: IImportAccountRequest) {
    await new AqueductRemote.Api.WalletService().importAccount({ request });
  }

  @Get('get_token_stats')
  @Tags('Accounts')
  public async getTokenStats(@Query() tokenAddress: string): Promise<ITokenStats> {
    const balance = await new AqueductRemote.Api.WalletService().getBalance({ tokenAddress });
    const allowance = await new AqueductRemote.Api.WalletService().getAllowance({ tokenAddress });
    return { balance, allowance };
  }

  @Post('set_unlimited_allowance')
  @Tags('Accounts')
  public async setUnlimitedAllowance(@Body() request: ISetAllowanceRequest) {
    const walletService = new AqueductRemote.Api.WalletService();
    await walletService.unlockAccount({ request: { passphrase: request.passphrase } });
    await walletService.setUnlimitedAllowance({ tokenAddress: request.tokenAddress });
  }

  @Get('get_eth_balance')
  @Tags('Accounts')
  public async getEthBalance(): Promise<string> {
    return await new AqueductRemote.Api.WalletService().getEthBalance();
  }
}
