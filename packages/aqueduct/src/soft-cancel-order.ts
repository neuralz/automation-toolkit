import * as Web3 from 'web3';
import { Aqueduct } from './generated/aqueduct';
import { Web3EnabledService } from './web3-enabled-service';

export interface ISoftCancelOrderParams {
  web3: Web3;

  /**
   * Order Hash
   */
  orderHash: string;
}

/**
 * Soft cancel an order by orderHash
 */
export class SoftCancelOrder extends Web3EnabledService<void> {
  constructor(private readonly params: ISoftCancelOrderParams) {
    super(params.web3);

    if (!params.orderHash) {
      throw new Error('no orderHash provided');
    }
  }

  protected async run() {
    const orderHash = this.params.orderHash;
    let order: Aqueduct.Api.IStandardOrder;
    try {
      order = await new Aqueduct.Api.StandardService().getOrderByHash({
        orderHash,
        networkId: this.networkId
      });
    } catch (err) {
      console.error(`failed get order with hash ${orderHash}`);
      throw err;
    }

    const signature = await this.sign(order.maker, orderHash);

    await new Aqueduct.Api.OrdersService().softCancelOrder({
      request: {
        orderHash,
        signature
      }
    });
  }

  private async sign(account: string, orderHash: string) {
    return new Promise<string>((resolve, reject) => {
      this.web3.eth.sign(account, '0x' + new Buffer(orderHash).toString('hex'), (err, sig) => {
        if (err) {
          return reject(err);
        }

        resolve(sig);
      });
    });
  }
}
