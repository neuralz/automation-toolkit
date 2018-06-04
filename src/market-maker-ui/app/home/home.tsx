import { observer } from 'mobx-react';
import * as React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { Dashboard } from '../../api/api';
import { LoadingScreen } from '../../common/loading-screen';
import { getPath } from '../../common/paths';
import { accountStore } from '../../stores/account-store';
import { marketStore } from '../../stores/market-store';
import { flashMessageStore } from '../flash-message/flash-message-store';
import { NoAccountModal } from '../no-account-modal';
import { EnterPassphraseModal } from './enter-passphrase-modal';
import { MarketView } from './market-view';
import { SelectMarket } from './select-market';

interface IHomeProps {
}

@observer
export class Home extends React.Component<IHomeProps> {
  public render() {
    if (typeof accountStore.status === 'undefined') {
      return <LoadingScreen />;
    }

    if (!accountStore.status.imported) {
      return <NoAccountModal />;
    }

    if (!accountStore.status.unlocked) {
      const onClose = () => { return; };
      return (
        <EnterPassphraseModal message='Enter your passphrase to unlock account' onClose={onClose}
          submitText='Unlock Account' onSubmit={this.onEnterPassphrase} />
      );
    }

    return (
      <div className='fl fh'>
        <SelectMarket />
        <Route path={getPath(p => p.home.market)} component={MarketView} />
        {marketStore.markets.length > 0 && <Redirect to={getPath(p => p.home.market, marketStore.markets[0]._id)} />}
      </div>
    );
  }

  private readonly onEnterPassphrase = async (passphrase: string) => {
    try {
      await new Dashboard.Api.AccountsService().unlockAccount({ request: { passphrase }});
      await accountStore.initialize();
    } catch (err) {
      flashMessageStore.addMessage({ type: 'error', content: err.message });
    }
  }
}
