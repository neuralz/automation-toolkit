import * as Web3 from 'web3';
import { Aqueduct } from '../generated/aqueduct';
import { SoftCancelOrder } from '../soft-cancel-order';

(async () => {
  Aqueduct.Initialize();

  await new SoftCancelOrder({
    orderHash: '0xc5d2902a1271efc05f947a80bdab4948b13d9465146dff5de038afc10bdca6b1',
    web3: new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  }).execute();

  console.log('order soft canceled');
})();
