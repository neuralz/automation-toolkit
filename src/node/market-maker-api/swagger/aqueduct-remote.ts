/* tslint:disable */
import { ApiService, IRequestParams } from './api-service';

export namespace AqueductRemote {
  let baseApiUrl: string;

  export const Initialize = (params: { host: string; }) => {
    baseApiUrl = `http://${params.host}`;
  };

  /**
   * Namespace representing REST API for ERC dEX
   */
  export namespace Api {

    export interface IOrder {
      id: number;
      dateCreated: Date;
      dateUpdated: Date;
      dateClosed: Date;
      networkId: number;
      exchangeContractAddress: string;
      expirationUnixTimestampSec: number;
      feeRecipient: string;
      maker: string;
      makerFee: string;
      makerTokenAddress: string;
      makerTokenAmount: string;
      salt: string;
      serializedEcSignature: string;
      taker: string;
      takerFee: string;
      takerTokenAddress: string;
      takerTokenAmount: string;
      remainingTakerTokenAmount: string;
      orderHash: string;
      accountId?: number;
      state: number;
      source: string;
    }

    export interface ILimitOrderRequest {
      baseTokenSymbol: string;
      quoteTokenSymbol: string;
      expirationDate: Date;
      price: string;
      quantityInWei: string;
      side: string;
    }

    export interface ICancelOrderRequest {
      orderHash: string;
      gasPrice?: string;
    }

    export interface ICancelReceipt {
      gasCost: string;
      status: number;
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

    export interface INetwork {
      id: number;
      chain: string;
    }


    export interface ITradingCreateLimitOrderParams {
      request: ILimitOrderRequest;
    }

    export interface ITradingCancelOrderParams {
      request: ICancelOrderRequest;
    }

    export interface ITradingSoftCancelOrderParams {
      orderHash: string;
    }

    export interface ITradingGetCancelReceiptParams {
      txHash: string;
    }

    export interface IWalletImportAccountParams {
      request: IImportAccountRequest;
    }

    export interface IWalletUnlockAccountParams {
      request: IUnlockAccountRequest;
    }

    export interface IWalletGetBalanceParams {
      tokenAddress: string;
    }

    export interface IWalletGetAllowanceParams {
      tokenAddress: string;
    }

    export interface IWalletSetUnlimitedAllowanceParams {
      tokenAddress: string;
    }
    export interface ITradingService {
      createLimitOrder(params: ITradingCreateLimitOrderParams): Promise<IOrder>;
      cancelOrder(params: ITradingCancelOrderParams): Promise<string>;
      softCancelOrder(params: ITradingSoftCancelOrderParams): Promise<void>;
      getCancelReceipt(params: ITradingGetCancelReceiptParams): Promise<ICancelReceipt>;
    }

    export class TradingService extends ApiService implements ITradingService {

      public async createLimitOrder(params: ITradingCreateLimitOrderParams) {
        const requestParams: IRequestParams = {
          method: 'POST',
          url: `${baseApiUrl}/api/trading/limit_order`
        };

        requestParams.body = params.request;
        return this.executeRequest<IOrder>(requestParams);
      }

      public async cancelOrder(params: ITradingCancelOrderParams) {
        const requestParams: IRequestParams = {
          method: 'POST',
          url: `${baseApiUrl}/api/trading/cancel_order`
        };

        requestParams.body = params.request;
        return this.executeRequest<string>(requestParams);
      }

      public async softCancelOrder(params: ITradingSoftCancelOrderParams) {
        const requestParams: IRequestParams = {
          method: 'POST',
          url: `${baseApiUrl}/api/trading/soft_cancel_order/${params.orderHash}`
        };
        return this.executeRequest<void>(requestParams);
      }

      public async getCancelReceipt(params: ITradingGetCancelReceiptParams) {
        const requestParams: IRequestParams = {
          method: 'POST',
          url: `${baseApiUrl}/api/trading/cancel_receipt/${params.txHash}`
        };
        return this.executeRequest<ICancelReceipt>(requestParams);
      }
    }
    export interface IWalletService {
      getAccount(): Promise<string>;
      importAccount(params: IWalletImportAccountParams): Promise<void>;
      removeAccount(): Promise<void>;
      unlockAccount(params: IWalletUnlockAccountParams): Promise<void>;
      getConfigurationStatus(): Promise<IConfigurationStatus>;
      getBalance(params: IWalletGetBalanceParams): Promise<string>;
      getAllowance(params: IWalletGetAllowanceParams): Promise<string>;
      setUnlimitedAllowance(params: IWalletSetUnlimitedAllowanceParams): Promise<void>;
      getEthBalance(): Promise<string>;
      getNetwork(): Promise<INetwork>;
    }

    export class WalletService extends ApiService implements IWalletService {

      public async getAccount() {
        const requestParams: IRequestParams = {
          method: 'GET',
          url: `${baseApiUrl}/api/wallet/account`
        };
        return this.executeRequest<string>(requestParams);
      }

      public async importAccount(params: IWalletImportAccountParams) {
        const requestParams: IRequestParams = {
          method: 'POST',
          url: `${baseApiUrl}/api/wallet/import`
        };

        requestParams.body = params.request;
        return this.executeRequest<void>(requestParams);
      }

      public async removeAccount() {
        const requestParams: IRequestParams = {
          method: 'DELETE',
          url: `${baseApiUrl}/api/wallet/remove`
        };
        return this.executeRequest<void>(requestParams);
      }

      public async unlockAccount(params: IWalletUnlockAccountParams) {
        const requestParams: IRequestParams = {
          method: 'POST',
          url: `${baseApiUrl}/api/wallet/unlock`
        };

        requestParams.body = params.request;
        return this.executeRequest<void>(requestParams);
      }

      public async getConfigurationStatus() {
        const requestParams: IRequestParams = {
          method: 'GET',
          url: `${baseApiUrl}/api/wallet/configuration_status`
        };
        return this.executeRequest<IConfigurationStatus>(requestParams);
      }

      public async getBalance(params: IWalletGetBalanceParams) {
        const requestParams: IRequestParams = {
          method: 'GET',
          url: `${baseApiUrl}/api/wallet/balance`
        };

        requestParams.queryParameters = {
          tokenAddress: params.tokenAddress,
        };
        return this.executeRequest<string>(requestParams);
      }

      public async getAllowance(params: IWalletGetAllowanceParams) {
        const requestParams: IRequestParams = {
          method: 'GET',
          url: `${baseApiUrl}/api/wallet/allowance`
        };

        requestParams.queryParameters = {
          tokenAddress: params.tokenAddress,
        };
        return this.executeRequest<string>(requestParams);
      }

      public async setUnlimitedAllowance(params: IWalletSetUnlimitedAllowanceParams) {
        const requestParams: IRequestParams = {
          method: 'POST',
          url: `${baseApiUrl}/api/wallet/unlimited_allowance`
        };

        requestParams.queryParameters = {
          tokenAddress: params.tokenAddress,
        };
        return this.executeRequest<void>(requestParams);
      }

      public async getEthBalance() {
        const requestParams: IRequestParams = {
          method: 'GET',
          url: `${baseApiUrl}/api/wallet/eth_balance`
        };
        return this.executeRequest<string>(requestParams);
      }

      public async getNetwork() {
        const requestParams: IRequestParams = {
          method: 'GET',
          url: `${baseApiUrl}/api/wallet/network`
        };
        return this.executeRequest<INetwork>(requestParams);
      }
    }
  }
}
