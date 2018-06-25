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

export interface IToken {
  name: string;
  address: string;
  symbol: string;
  decimals: number;
}

export interface ITokenPair {
  tokenA: IToken;
  tokenB: IToken;
  minimumQuantity: string;
  priceDecimals: number;
  baseVolume: string;
  quoteVolume: string;
}
