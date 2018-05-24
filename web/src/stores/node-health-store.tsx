import { observable } from 'mobx';
import * as request from 'superagent';

interface IParityHealth {
  jsonrpc: string;
  result: {
    peers: {
      details: [number, number],
      message: string;
      status: string;
    }
    sync: {
      details: boolean;
      message: string;
      status: 'ok' | 'needsAttention';
    };
    time: {
      details: number;
      message: string;
      status: string;
    };
  };
  id: number;
  block: string;
}

export interface IProcessedHealth {
  status: 'ready' | 'pending';
  message: string;
  peers: [number, number];
  block: string;
  raw: IParityHealth;
}

export class NodeHealthStore {
  @observable public health?: IProcessedHealth;

  constructor() {
    this.beginHealthPolling();
  }

  private async beginHealthPolling() {
    setInterval(() => {
      this.loadLogs();
    }, 5000);
    this.loadLogs();
  }

  private loadLogs() {
    request('/health-logs/latest-health.json')
      .end((_err, res) => {
        const health: IParityHealth = res.body;

        const message = this.getHealthMessage(health);
        if (!message) {
          this.health = {
            message: 'ready',
            peers: health.result.peers.details,
            status: 'ready',
            block: health.block,
            raw: health
          };
        } else {
          this.health = {
            message,
            peers: health.result.peers.details,
            status: 'pending',
            block: health.block,
            raw: health
          };
        }
      });
  }

  private getHealthMessage(health: IParityHealth) {
    if (health.result.peers.status !== 'ok') {
      return health.result.peers.message;
    }

    if (health.result.sync.status !== 'ok') {
      return health.result.sync.message;
    }

    return undefined;
  }
}

export const nodeHealthStore = new NodeHealthStore();
