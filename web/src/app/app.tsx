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
  private interval: any;
  @observable private health?: {
    status: 'ready' | 'pending';
    message: string;
    peers: [number, number]
  };

  constructor(public readonly props: IAppProps) {
    super(props);
    this.beginHealthPolling();
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
    this.interval = setInterval(() => {
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
            status: 'ready'
          };
          clearInterval(this.interval);
        } else {
          this.health = {
            message,
            peers: health.result.peers.details,
            status: 'pending'
          };
        }
      });
  }
}
