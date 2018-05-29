import BigNumber from 'bignumber.js';
import * as Web3 from 'web3';
import { Aqueduct } from './generated/aqueduct';
import { Web3EnabledService } from './web3-enabled-service';

export interface ICancelOrderParams {
  /**
   * Web3 instance
   */
  web3: Web3;

  /**
   * Order Hash
   */
  orderHash: string;

  /**
   * Gas Price
   */
  gasPrice?: string | number | BigNumber;
}

/**
 * Cancel an order by orderHash; returns txHash if successful
 */
export class CancelOrder extends Web3EnabledService<string> {
  constructor(private readonly params: ICancelOrderParams) {
    super(params.web3);

    if (!params.orderHash) {
      throw new Error('no orderHash provided');
    }
  }

  protected async run() {
    let order: Aqueduct.Api.IStandardOrder;
    try {
      order = await new Aqueduct.Api.StandardService().getOrderByHash({
        orderHash: this.params.orderHash,
        networkId: this.networkId
      });
    } catch (err) {
      console.error(`failed get order with hash ${this.params.orderHash}`);
      throw err;
    }

    const signedOrder = Aqueduct.Utils.convertStandardOrderToSignedOrder(order);

    try {
      return await this.zeroEx.exchange.cancelOrderAsync(signedOrder, new BigNumber(signedOrder.takerTokenAmount), {
        gasPrice: this.params.gasPrice ? new BigNumber(this.params.gasPrice) : undefined
      });
    } catch (err) {
      console.error('failed to cancel order');
      throw err;
    }
  }
}
