import { Dashboard } from 'api/api';
import { flashMessageStore } from 'app/flash-message/flash-message-store';
import { ConfirmModal, IConfirmModalProps } from 'common/modal/confirm-modal';
import { getPath } from 'common/paths';
import { History } from 'history';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Redirect } from 'react-router';
import { marketStore } from 'stores/market-store';
import { tokenPairStore } from 'stores/token-pair-store';
import { BalanceHistory } from './balance-history';
import { Bands } from './bands/bands';
import { EditMarket } from './edit-market';
import { MarketLogViewer } from './log-viewer/market-log-viewer';
import { MarketStats } from './market-stats';
import './market-view.scss';
import { ReportsModal } from './reports/reports-modal';
import { ISelectStopBehaviorProps, SelectStopBehavior } from './select-stop-behavior';

interface IMarketViewProps {
  history: History;
  match: {
    params: {
      id: string;
    };
  };
}

@observer
export class MarketView extends React.Component<IMarketViewProps> {
  @observable private market?: Dashboard.Api.IStoredMarket;
  @observable private isStarted = false;
  @observable private isViewingLogs = false;
  @observable private selectStopBehaviorProps?: ISelectStopBehaviorProps;
  @observable private marketUrl = '';
  @observable private isViewingHistory = false;
  @observable private isViewingReports = false;
  @observable private confirmDeleteProps?: IConfirmModalProps;
  @observable private isEditing = false;

  constructor(public readonly props: IMarketViewProps) {
    super(props);
    this.loadMarket();
  }

  public componentDidUpdate(prevProps: IMarketViewProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.loadMarket();
    }
  }

  public render() {
    if (!this.market) {
      const markets = marketStore.markets;
      if (markets.length === 0) {
        return <Redirect to={getPath(p => p.home)} />;
      } else {
        return <Redirect to={getPath(p => p.home.market, { id: markets[0]._id })} />;
      }
    }

    const { baseTokenSymbol, quoteTokenSymbol } = this.market;
    const tokenPair = tokenPairStore.getTokenPairsBySymbols({ baseTokenSymbol, quoteTokenSymbol });

    return (
      <div className='market-view grow fl co'>
        <div className='fl sb market-view-header'>
          <div className='fl fe'>
            <div className='fl v-padding'>
              <h1>{this.market.label}</h1>
              <div className={`control start fl vc ${!this.isStarted ? 'active' : 'inactive'}`} onClick={this.onStart(this.market)}>
                <img src='/images/start.svg' />
                <span>Start</span>
              </div>
              <div className={`control stop fl vc ${this.isStarted ? 'active' : 'inactive'}`} onClick={this.onStop(this.market)}>
                <i className='fa fa-stop' />
                <span>Stop</span>
              </div>
              <div className={`control fl vc`} onClick={this.onViewHistory}>
                <img src='/images/toolsHistory.svg' />
                <span>History</span>
              </div>
              <div className={`control logs fl vc`} onClick={this.onViewLogs}>
                <img src='/images/toolLogs.svg' />
                <span>Logs</span>
              </div>
              <div className={`control reports fl vc`} onClick={this.onViewReports}>
                <img src='/images/reports.svg' />
                <span>Reports</span>
              </div>
            </div>
            <div className='separator' />
            <a className='to-market control fl vc' href={this.marketUrl} target='_blank'>
              <img src='/images/toolPopout.svg' />
              <span>Live Market</span>
            </a>
          </div>
          <div className='fl'>
            <div className='fl vc'>
              <i className='fa fa-cog edit-market-icon' onClick={this.onClickEditMarket} />
            </div>
            <div className={`fl vc ${this.isStarted ? 'inactive' : 'active'}`} onClick={this.onDelete(this.market)}
              title={this.isStarted ? 'Market is currently running - stop first to delete' : undefined}>
              <div className='oval delete-market'>
                <img src='/images/toolDelete.svg' alt='Delete Market' />
              </div>
            </div>
          </div>
        </div>
        <MarketStats tokenPair={tokenPair} market={this.market} />
        <Bands tokenPair={tokenPair} marketId={this.market._id} />
        {this.isViewingReports && <ReportsModal marketId={this.market._id} onClose={this.onCloseReports} />}
        {this.isViewingHistory && <BalanceHistory marketId={this.market._id} tokenPair={tokenPair} onClose={this.onCloseBalanceHistory} />}
        {this.isViewingLogs && <MarketLogViewer onClose={this.onCloseViewLogs} marketId={this.market._id} />}
        {this.selectStopBehaviorProps && <SelectStopBehavior {...this.selectStopBehaviorProps} />}
        {this.confirmDeleteProps && <ConfirmModal {...this.confirmDeleteProps}>
          Are you sure you want to remove this market? This action is irreversible.
          </ConfirmModal>}
        {this.isEditing && <EditMarket onClose={this.onCloseEditMarket} market={this.market} onSuccess={this.onSuccess} />}
      </div>
    );
  }

  private readonly onCloseEditMarket = () => this.isEditing = false;
  private readonly onClickEditMarket = () => this.isEditing = true;

  private async loadMarket() {
    this.market = marketStore.markets.find(m => m._id === this.props.match.params.id);
    this.isStarted = !!(this.market && this.market.active);

    if (this.market) {
      const networkId = await new Dashboard.Api.MarketsService().getNetworkId();
      const ercDexBaseUrl = `https://${networkId === 42 ? 'test' : 'app'}.ercdex.com`;
      this.marketUrl = `${ercDexBaseUrl}/#/${this.market.baseTokenSymbol}/${this.market.quoteTokenSymbol}`;
    } else {
      this.marketUrl = '';
    }
  }

  private readonly onDelete = (market: Dashboard.Api.IStoredMarket) => async () => {
    this.confirmDeleteProps = {
      title: 'Remove Market',
      onClose: () => this.confirmDeleteProps = undefined,
      onError: (err) => flashMessageStore.addMessage({
        content: err.message,
        type: 'error'
      }),
      submitText: 'Remove Market',
      onSubmit: async () => {
        await new Dashboard.Api.MarketsService().deleteMarket({ marketId: market._id });
        flashMessageStore.addMessage({
          content: `Market '${market.label}' successfully deleted.`,
          type: 'success'
        });
        await marketStore.initialize();
        this.loadMarket();
      }
    };
  }

  private onStop = (market: Dashboard.Api.IStoredMarket) => async () => {
    const validateStop = await new Dashboard.Api.MarketsService().validateStop({
      id: market._id
    });
    if (validateStop.hasActiveBands) {
      this.selectStopBehaviorProps = {
        onClose: () => this.selectStopBehaviorProps = undefined,
        onSelect: async (hardCancelation: boolean) => await this.executeStop(market._id, hardCancelation),
        message: 'There are currently live orders in this market.',
        submitText: 'Stop Market'
      };
      return;
    }

    await this.executeStop(market._id, false);
  }

  private async executeStop(marketId: string, hardCancelation: boolean) {
    try {
      await new Dashboard.Api.MarketsService().stopMarket({
        request: {
          marketId,
          hardCancelation
        }
      });
      await this.refresh();
    } catch (err) {
      flashMessageStore.addMessage({
        content: err.message,
        type: 'error'
      });
    }
  }

  private async refresh() {
    await marketStore.initialize();
    this.loadMarket();
  }

  private readonly onViewLogs = () => this.isViewingLogs = true;
  private readonly onCloseViewLogs = () => this.isViewingLogs = false;
  private readonly onViewHistory = () => this.isViewingHistory = true;
  private readonly onViewReports = () => this.isViewingReports = true;
  private readonly onCloseBalanceHistory = () => this.isViewingHistory = false;
  private readonly onCloseReports = () => this.isViewingReports = false;

  private onStart = (market: Dashboard.Api.IStoredMarket) => async () => {
    try {
      await new Dashboard.Api.MarketsService().startMarket({
        request: {
          marketId: market._id
        }
      });
      await this.refresh();
    } catch (err) {
      flashMessageStore.addMessage({
        content: err.message,
        type: 'error'
      });
    }
  }

  private readonly onSuccess = () => {
    this.refresh();
  }
}
