import { Modal } from 'common/modal/modal';
import * as React from 'react';
import './live-market.scss';

interface ILiveMarketProps {
  url: string;
  onClose: () => void;
}

export class LiveMarket extends React.Component<ILiveMarketProps> {
  public render() {
    return (
      <Modal onClose={this.props.onClose} className='live-market'>
        <iframe src={this.props.url} />
      </Modal>
    );
  }
}
