/* tslint:disable */
import { ApiService, IRequestParams } from './api-service';

export namespace AqueductServer {
  let baseApiUrl: string;

  export const Initialize = (params: { host: string; }) => {
    baseApiUrl = `http://${params.host}`;
  };

  /**
   * Namespace representing REST API for ERC dEX
   */
  export namespace Api {

    export interface IOrder {
      /**
       * Unique Identifier
       */
      id: number;
      /**
       * Date of creation
       */
      dateCreated: Date;
      /**
       * Date of updated
       */
      dateUpdated: Date;
      /**
       * Date on which the order was closed through fill, cancel, etc
       */
      dateClosed?: Date;
      /**
       * ID of the Ethereum network the order is associated with
       */
      networkId: number;
      /**
       * 0x Exchange Contract Address
       */
      exchangeContractAddress: string;
      /**
       * Unix timestamp of order expiration (in seconds)
       */
      expirationUnixTimestampSec: number;
      /**
       * Address of the fee recipient
       */
      feeRecipient: string;
      /**
       * Address of the order maker
       */
      maker: string;
      /**
       * Fee due from maker on order fill
       */
      makerFee: string;
      /**
       * Token address of the maker token
       */
      makerTokenAddress: string;
      /**
       * Total amount of maker token in order
       */
      makerTokenAmount: string;
      /**
       * Secure salt
       */
      salt: string;
      /**
       * Serialized version of the EC signature for signed orders
       */
      serializedEcSignature: string;
      /**
       * Taker address; generally a null taker
       */
      taker: string;
      /**
       * Fee due from taker on order fill
       */
      takerFee: string;
      /**
       * Token address of the taker token
       */
      takerTokenAddress: string;
      /**
       * Total amount of taker token in order
       */
      takerTokenAmount: string;
      /**
       * Remaining amount in the order in terms of taker token units
       */
      remainingTakerTokenAmount: string;
      /**
       * The hash of the signed order
       */
      orderHash: string;
      /**
       * Account ID of originator
       */
      accountId?: number;
      /**
       * State of the order: Open (0), Canceled (1), Filled (2), Expired(3), Removed(4), PendingCancel (5)
       */
      state: number;
      source: string;
      price: string;
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

    export interface IFillOrderRequest {
      orderHash: string;
      takerAmountInWei: string;
    }

    export interface ICancelReceipt {
      gasCost: string;
      status: number;
    }

    export interface IFillReceipt {
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

    export interface ITradingFillOrderParams {
      request: IFillOrderRequest;
    }

    export interface ITradingGetCancelReceiptParams {
      /**
       * Transaction Hash
       */
      txHash: string;
    }

    export interface ITradingGetFillReceiptParams {
      /**
       * Transaction Hash
       */
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
      /**
       * Soft cancel an order by orderHash
Removes the order from the order book, but can still be potentially filled
       */
      softCancelOrder(params: ITradingSoftCancelOrderParams): Promise<void>;
      /**
       * Fill an order by orderHash
       */
      fillOrder(params: ITradingFillOrderParams): Promise<string>;
      /**
       * Attempt to retrieve the transaction receipt of a cancellation\
       */
      getCancelReceipt(params: ITradingGetCancelReceiptParams): Promise<ICancelReceipt>;
      /**
       * Syncronously retrieve the transaction receipt of a order fill
       */
      getFillReceipt(params: ITradingGetFillReceiptParams): Promise<IFillReceipt>;
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

      /**
       * Soft cancel an order by orderHash
Removes the order from the order book, but can still be potentially filled
       */
      public async softCancelOrder(params: ITradingSoftCancelOrderParams) {
        const requestParams: IRequestParams = {
          method: 'POST',
          url: `${baseApiUrl}/api/trading/soft_cancel_order/${params.orderHash}`
        };
        return this.executeRequest<void>(requestParams);
      }

      /**
       * Fill an order by orderHash
       */
      public async fillOrder(params: ITradingFillOrderParams) {
        const requestParams: IRequestParams = {
          method: 'POST',
          url: `${baseApiUrl}/api/trading/fill_order`
        };

        requestParams.body = params.request;
        return this.executeRequest<string>(requestParams);
      }

      /**
       * Attempt to retrieve the transaction receipt of a cancellation\
       */
      public async getCancelReceipt(params: ITradingGetCancelReceiptParams) {
        const requestParams: IRequestParams = {
          method: 'POST',
          url: `${baseApiUrl}/api/trading/cancel_receipt/${params.txHash}`
        };
        return this.executeRequest<ICancelReceipt>(requestParams);
      }

      /**
       * Syncronously retrieve the transaction receipt of a order fill
       */
      public async getFillReceipt(params: ITradingGetFillReceiptParams) {
        const requestParams: IRequestParams = {
          method: 'POST',
          url: `${baseApiUrl}/api/trading/fill_receipt/${params.txHash}`
        };
        return this.executeRequest<IFillReceipt>(requestParams);
      }
    }
    export interface IWalletService {
      getAccount(): Promise<string>;
      importAccount(params: IWalletImportAccountParams): Promise<void>;
      removeAccount(): Promise<void>;
      unlockAccount(params: IWalletUnlockAccountParams): Promise<void>;
      lockAccount(): Promise<void>;
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

      public async lockAccount() {
        const requestParams: IRequestParams = {
          method: 'POST',
          url: `${baseApiUrl}/api/wallet/lock`
        };
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
