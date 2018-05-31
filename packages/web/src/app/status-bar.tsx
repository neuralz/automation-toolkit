import { Dashboard } from 'api/api';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import './status-bar.scss';

interface IStatusBarProps {
}

@observer
export class StatusBar extends React.Component<IStatusBarProps> {
  @observable private network?: string;

  public componentDidMount() {
    this.load();
  }

  public render() {
    return (
      <div className='status-bar'>
        {this.network && <span>Connected to {this.network}</span>}
      </div>
    );
  }

  private async load() {
    const network = await new Dashboard.Api.AccountsService().getNetwork();
    this.network = network.id === 1 ? 'Mainnet' : 'Kovan';
  }
}
