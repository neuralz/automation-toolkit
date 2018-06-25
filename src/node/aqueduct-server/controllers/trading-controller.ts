import { CancelOrder, FillOrder, LimitOrder, SoftCancelOrder } from 'aqueduct';
import { BigNumber } from 'bignumber.js';
import { Body, Post, Route, Tags } from 'tsoa';
import { IOrder } from '../internal-aqueduct-types';
import { ServerError } from '../server-error';
import { KeyService } from '../services/key-service';
import { web3service } from '../services/web3-service';
import { ICancelReceipt, IFillReceipt, ZeroExService } from '../services/zero-ex-service';

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

  /**
   * Soft cancel an order by orderHash
   * Removes the order from the order book, but can still be potentially filled
   */
  @Post('soft_cancel_order/{orderHash}')
  @Tags('Trading')
  public async softCancelOrder(orderHash: string) {
    // immediately removes it from the book
    await new SoftCancelOrder({
      web3: web3service.getWeb3(),
      orderHash
    }).execute();
  }

  /**
   * Fill an order by orderHash
   */
  @Post('fill_order')
  @Tags('Trading')
  public async fillOrder(@Body() request: IFillOrderRequest): Promise<string> {
    const account = await new KeyService().getAccount();
    const { orderHash, takerAmountInWei } = request;

    const txHash = await new FillOrder({
      web3: web3service.getWeb3(),
      account,
      orderHash,
      takerAmountInWei: new BigNumber(takerAmountInWei)
    }).execute();

    return txHash;
  }

  /**
   * Attempt to retrieve the transaction receipt of a cancellation\
   * @param txHash Transaction Hash
   */
  @Post('cancel_receipt/{txHash}')
  @Tags('Trading')
  public async getCancelReceipt(txHash: string): Promise<ICancelReceipt> {
    return await new ZeroExService().getCancelReceipt(txHash);
  }

  /**
   * Syncronously retrieve the transaction receipt of a order fill
   * @param txHash Transaction Hash
   */
  @Post('fill_receipt/{txHash}')
  @Tags('Trading')
  public async getFillReceipt(txHash: string): Promise<IFillReceipt> {
    return await new ZeroExService().getFillReceipt(txHash);
  }
}
