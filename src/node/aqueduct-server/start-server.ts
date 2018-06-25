import chalk from 'chalk';
import * as readline from 'readline-sync';
import { startAqueductServer } from './server';
import { KeyService } from './services/key-service';

const ask = (message: string, mute?: boolean) => {
  return readline.question(message, { hideEchoBack: mute });
};

(async () => {
  const network = await ask(`What Ethereum network do you want to connect to? (${chalk.cyan('mainnet')} | ${chalk.green('kovan')})\n`);
  if (network !== 'kovan' && network !== 'mainnet') {
    console.log(chalk.red(`Only 'mainnet' or 'kovan' supported`));
    process.exit(0);
    return;
  }

  console.log(chalk.whiteBright('Starting server...'));
  await startAqueductServer(__dirname, {
    chain: network,
    id: network === 'kovan' ? 42 : 1
  }, '0.0.0.0', '/app/keys');

  console.log(chalk.whiteBright('Checking server status...'));
  const keyService = new KeyService();

  const isImported = keyService.isImported();
  if (!isImported) {
    console.log(chalk.cyan('No wallet has been imported.\nProvide a private key an secure it with a passphrase.'));
    const privateKey = await ask('Enter private key:\n', true);
    const passphrase = await ask('Enter passphrase:\n', true);
    const confirmPassphrase = await ask('Confirm passphrase:\n', true);

    if (passphrase !== confirmPassphrase) {
      console.log(chalk.red('Passphrase and confirm passphrase must match.'));
      process.exit(0);
    }

    try {
      keyService.importAccount({ passphrase, key: privateKey });
      console.log(chalk.green('Wallet successfully imported.'));
    } catch (err) {
      console.log(chalk.red(`Import failed.\n${err.message}`));
      process.exit(0);
    }
  } else if (!keyService.isUnlocked()) {
    console.log(chalk.cyan('Account locked.'));
    const passphrase = await ask('Enter passphrase:\n', true);
    keyService.unlockAccount({ passphrase });
  }
})();
