import { LoadingScreen } from 'common/loading-screen';
import { getPath } from 'common/paths';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router';
import { accountStore } from 'stores/account-store';
import { marketStore } from 'stores/market-store';
import { tickerStore } from 'stores/ticker-store';
import { tokenPairStore } from 'stores/token-pair-store';
import './app.scss';
import { FlashMessage } from './flash-message/flash-message';
import { Home } from './home/home';
import { StatusBar } from './status-bar';

interface IAppProps {
}

@(withRouter as any)
@observer
export class App extends React.Component<IAppProps> {
  constructor(public readonly props: IAppProps) {
    super(props);
    this.load();
  }

  public render() {
    if (!tokenPairStore.tokenPairs) {
      return <LoadingScreen height='100%' message='Initializing' />;
    }

    return (
      <div className='app fl co'>
        <FlashMessage />
        <div className='app-content'>
          <Switch>
            <Route path={getPath(p => p.home)} component={Home} />
            <Redirect to={getPath(p => p.home)} />
          </Switch>
        </div>
        <StatusBar />
      </div>
    );
  }

  private async load() {
    try {
      await this.initializeStores();
    } catch (err) {
      setTimeout(async () => {
        await this.initializeStores();
      }, 1000);
    }
  }

  private async initializeStores() {
    await Promise.all([
      tokenPairStore.initialize(),
      marketStore.initialize(),
      accountStore.initialize(),
      tickerStore.initialize()
    ]);
  }
}
