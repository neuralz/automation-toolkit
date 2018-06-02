import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Dashboard } from '../../api/api';
import { Button } from '../../common/form/button';
import { Form } from '../../common/form/form';
import { Modal } from '../../common/modal/modal';
import { flashMessageStore } from '../flash-message/flash-message-store';

interface IEditMarketProps {
  market: Dashboard.Api.IStoredMarket;
  onClose: () => void;
  onSuccess: () => void;
}

type CancellationMode = 'hard' | 'soft';

@observer
export class EditMarket extends React.Component<IEditMarketProps> {
  @observable private cancellationMode: CancellationMode;
  @observable private isProcessing = false;

  constructor(public readonly props: IEditMarketProps) {
    super(props);
    this.cancellationMode = props.market.cancellationMode === 'soft' ? 'soft' : 'hard';
  }

  public render() {
    return (
      <Modal title='Edit Market' onClose={this.props.onClose}>
        <Form onSubmit={this.onSubmit}>
          <div>
            <label>Cancelation Mode</label>
            <div>
              <label className='radio-label'>
                <input type='radio' value='hard' checked={this.cancellationMode === 'hard'} onClick={this.handleModeSelect('hard')} />
                <span>Hard Cancellation (costs gas, removed from blockchain)</span>
              </label>
              <label className='radio-label'>
                <input type='radio' value='soft' checked={this.cancellationMode === 'soft'} onClick={this.handleModeSelect('soft')} />
                <span>Soft Cancellation (no gas costs, removes from ERC dEX UI)</span>
              </label>
            </div>
          </div>
          <div className='t-padding'>
            <Button className='button primary fw' isProcessing={this.isProcessing}>Update Market</Button>
          </div>
        </Form>
      </Modal>
    );
  }

  private readonly handleModeSelect = (mode: 'hard' | 'soft') => () => this.cancellationMode = mode;

  private onSubmit = async () => {
    this.isProcessing = true;
    try {
      await new Dashboard.Api.MarketsService().setCancellationMode({
        request: {
          cancellationMode: this.cancellationMode,
          marketId: this.props.market._id
        }
      });
      this.props.onSuccess();
      this.props.onClose();
    } catch (err) {
      flashMessageStore.addMessage({
        type: 'error',
        content: err.message
      });
    }
    this.isProcessing = false;
  }
}
