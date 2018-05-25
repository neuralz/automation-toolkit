const chain = process.env['ETHEREUM_CHAIN'];
if (!chain) {
  throw new Error(`ETHEREUM_CHAIN env var not set`);
}

if (chain !== 'mainnet' && chain !== 'kovan') { throw new Error(`ETHEREUM_CHAIN must be 'mainnet' or 'kovan'`); }

const networkId = chain === 'mainnet' ? 1 : 42;
const nodeUrl = networkId === 1 ? 'https://mainnet.infura.io' : 'https://kovan.infura.io';

export const config = {
  nodeUrl,
  networkId,
  chain
};
