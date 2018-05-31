import { startAqueductServer } from './server';

startAqueductServer(__dirname, {
  id: 42,
  chain: 'kovan'
});
