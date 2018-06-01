import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Dashboard } from '../api/api';
import { ConfirmModal } from '../common/modal/confirm-modal';
import { accountStore } from '../stores/account-store';
import { flashMessageStore } from './flash-message/flash-message-store';
import './status-bar.scss';

interface IStatusBarProps {
}

@observer
export class StatusBar extends React.Component<IStatusBarProps> {
  @observable private network?: string;
  @observable private isConfirmingRemove = false;

  public componentDidMount() {
    this.load();
  }

  public render() {
    return (
      <React.Fragment>
        <div className='status-bar fl sb'>
          <span>
            {accountStore.account && <span>
              <span className='connected-circle' />
              <strong>ACCOUNT</strong>
              <span> {accountStore.account.toLowerCase()} </span>
              <span className='link remove-account-link' onClick={this.onClickRemoveAccount}>REMOVE ACCOUNT</span>
            </span>}
          </span>
          {this.network && <span>CONNECTED TO {this.network}</span>}
        </div>
        {this.isConfirmingRemove && accountStore.account && <ConfirmModal title='Confirm Account Removal'
          onClose={this.onCloseConfirmRemove} submitText='Confirm Removal' onSubmit={this.onSubmit} onError={this.onError}>
          Are you sure you want to remove {accountStore.account}? This action cannot be reversed.
        </ConfirmModal>}
      </React.Fragment>
    );
  }

  private async load() {
    const network = await new Dashboard.Api.AccountsService().getNetwork();
    this.network = network.id === 1 ? 'MAINNET' : 'KOVAN';
  }

  private readonly onClickRemoveAccount = () => this.isConfirmingRemove = true;
  private readonly onCloseConfirmRemove = () => this.isConfirmingRemove = false;

  private readonly onError = (err: any) => {
    flashMessageStore.addMessage({ type: 'error', content: err.message });
  }
  private readonly onSubmit = async () => {
    await new Dashboard.Api.AccountsService().removeAccount();
    await accountStore.initialize();
  }
}
