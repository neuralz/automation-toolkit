import { Web3Service } from '../services/web3-service';
import { sleep } from '../utils/sleep';

const web3service = new Web3Service();

export class NodeHealthWorker {
  public async start(onReady: () => void) {
    while (true) {
      const status = await web3service.getParityNodeHealth();
      if (status.success) {
        console.info('parity ready');
        onReady();
      } else {
        console.info(status.error);
      }

      await sleep(5000);
    }
  }
}
