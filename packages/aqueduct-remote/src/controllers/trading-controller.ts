import { CancelOrder, LimitOrder, SoftCancelOrder } from '@ercdex/aqueduct';
import { Body, Post, Route, Tags } from 'tsoa';
import { ServerError } from '../server-error';
import { KeyService } from '../services/key-service';
import { web3service } from '../services/web3-service';
import { ICancelReceipt, ZeroExService } from '../services/zero-ex-service';

export interface ILimitOrderRequest {
  baseTokenSymbol: string;
  quoteTokenSymbol: string;
  expirationDate: Date;
  price: string;
  quantityInWei: string;
  side: string;
}

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

export interface ICancelOrderRequest {
  orderHash: string;
  gasPrice?: string;
}

@Route('trading')
export class TradingController {
  @Post('limit_order')
  @Tags('Trading')
  public async createLimitOrder(@Body() request: ILimitOrderRequest): Promise<IOrder> {
    try {
      const account = await new KeyService().getAccount();
    const {
      baseTokenSymbol, quoteTokenSymbol,
      price, quantityInWei, expirationDate, side
    } = request;

    if (side !== 'buy' && side !== 'sell') {
      throw new ServerError(`side must be buy or sell; got ${side}`, 400);
    }

    const order = await new LimitOrder({
      account,
      baseTokenSymbol,
      quoteTokenSymbol,
      price,
      expirationDate,
      type: request.side as 'buy' | 'sell',
      quantityInWei,
      web3: web3service.getWeb3()
    }).execute();

    return order;
    } catch (err) {
      console.log(err, err.stack);
      throw err;
    }
  }

  @Post('cancel_order')
  @Tags('Trading')
  public async cancelOrder(@Body() request: ICancelOrderRequest): Promise<string> {
    const txHash = await new CancelOrder({
      web3: web3service.getWeb3(),
      orderHash: request.orderHash,
      gasPrice: request.gasPrice
    }).execute();

    // immediately removes it from the book
    await new SoftCancelOrder({
      web3: web3service.getWeb3(),
      orderHash: request.orderHash
    }).execute();

    return txHash;
  }

  @Post('soft_cancel_order/{orderHash}')
  @Tags('Trading')
  public async softCancelOrder(orderHash: string) {
    // immediately removes it from the book
    await new SoftCancelOrder({
      web3: web3service.getWeb3(),
      orderHash
    }).execute();
  }

  @Post('cancel_receipt/{txHash}')
  @Tags('Trading')
  public async getCancelReceipt(txHash: string): Promise<ICancelReceipt> {
    return await new ZeroExService().getCancelReceipt(txHash);
  }
}
