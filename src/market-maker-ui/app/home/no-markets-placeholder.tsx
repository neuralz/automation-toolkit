import * as React from 'react';
import { marketStore } from '../../stores/market-store';
import './no-markets-placeholder.scss';

interface INoMarketsPlaceholderProps {
}

export class NoMarketsPlaceholder extends React.Component<INoMarketsPlaceholderProps> {
  public render() {
    return (
      <div className='no-markets-placeholder fw fl vc c'>
        <div>
          <img className='preview' src='images/no-markets.png' />
          <div className='header t-margin'>No Market Activity</div>
          <div className='subheader'>Add a market to get started</div>
          <div className='fl c'>
            <div className='oval add-icon t-margin' onClick={this.onCreateNewMarketClick}>
              <img src='images/add.svg' alt='Create New Market' title='Create New Market' />
            </div>
          </div>
        </div>
      </div>
    );
  }

  private readonly onCreateNewMarketClick = () => marketStore.isCreatingMarket = true;
}
