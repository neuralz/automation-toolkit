import { LoadingScreen } from 'common/loading-screen';
import { getPath } from 'common/paths';
import { autorun, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router';
import { IProcessedHealth, nodeHealthStore } from 'stores/node-health-store';
import './app.scss';
import { FlashMessage } from './flash-message/flash-message';
import { Home } from './home/home';
import { NavBar } from './nav-bar/nav-bar';

interface IAppProps {
}

@withRouter
@observer
export class App extends React.Component<IAppProps> {
  @observable private health?: IProcessedHealth;

  constructor(public readonly props: IAppProps) {
    super(props);
    autorun(() => {
      if (!this.health || this.health.status !== 'ready') {
        this.health = nodeHealthStore.health;
      }
    });
  }

  public render() {
    if (!this.health) {
      return <LoadingScreen />;
    }

    if (this.health.status === 'pending') {
      return (
        <LoadingScreen message={(<div>
          <div>{this.health.message}</div>
          <strong>{this.health.peers[0]}/{this.health.peers[1]} peers</strong>
        </div>)} />
      );
    }

    return (
      <div className='app fl co'>
        <NavBar />
        <FlashMessage />
        <div className='app-content'>
          <Switch>
            <Route path={getPath(p => p.home)} component={Home} />
            <Redirect to={getPath(p => p.home)} />
          </Switch>
        </div>
      </div>
    );
  }
}
