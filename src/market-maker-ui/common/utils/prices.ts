import { BigNumber } from '@0xproject/utils';

export const getAbsoluteSpread = (price: BigNumber, bps: number) => {
  return price.times(bps.toString()).times(.0001);
};
