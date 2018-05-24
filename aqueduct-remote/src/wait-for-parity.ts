#!/usr/bin/env node
import { NodeHealthWorker } from './workers/node-health-worker';

export const waitForParity = async () => {
  return new Promise(r => {
    let hasSentReady = false;
    new NodeHealthWorker().start(() => {
      if (!hasSentReady) {
        hasSentReady = true;
        r();
      }
    });
  });
};
