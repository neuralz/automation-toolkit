import { LoadingScreen } from 'common/loading-screen';
import { getPath } from 'common/paths';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router';
import * as request from 'superagent';
import './app.scss';
import { FlashMessage } from './flash-message/flash-message';
import { Home } from './home/home';
import { NavBar } from './nav-bar/nav-bar';

interface IAppProps {
}

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
}

@withRouter
@observer
export class App extends React.Component<IAppProps> {
  @observable private health?: IParityHealth;

  constructor(public readonly props: IAppProps) {
    super(props);
    this.beginHealthPolling();
  }

  public render() {
    if (!this.health) {
      return <LoadingScreen />;
    }

    const message = this.getHealthMessage(this.health);
    if (message) {
      return (
        <LoadingScreen message={(<div>
          <div>{message}</div>
          <strong>{this.health.result.peers.details[0]}/{this.health.result.peers.details[1]} peers</strong>
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

  private getHealthMessage(health: IParityHealth) {
    if (health.result.peers.status !== 'ok') {
      return health.result.peers.message;
    }

    if (health.result.sync.status !== 'ok') {
      return health.result.sync.message;
    }

    return undefined;
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
        this.health = res.body;
      });
  }
}
