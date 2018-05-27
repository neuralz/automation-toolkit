import { Dashboard } from 'api/api';
import { flashMessageStore } from 'app/flash-message/flash-message-store';
import { BigNumber } from 'bignumber.js';
import { Form } from 'common/form/form';
import { Select } from 'common/form/select';
import { TextInput } from 'common/form/text-input';
import { HoverTooltip } from 'common/hover-tooltip';
import { InlineLoader } from 'common/inline-loader';
import { Modal } from 'common/modal/modal';
import { isValidFloat } from 'common/utils/numbers';
import { toBaseUnitAmount, toUnitAmount } from 'common/utils/unit-amount';
import { autorun, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { tickerStore } from 'stores/ticker-store';
import { tokenPairStore } from 'stores/token-pair-store';
import './create-market.scss';
import { EnterPassphraseModal } from './enter-passphrase-modal';
import { ITokenReserveParams, TokenReserveInput } from './token-reserve-input';

interface ICreateMarketProps {
  onClose: () => void;
  onSuccess: (market: Dashboard.Api.IStoredMarket) => void;
}

export interface ITokenStats {
  balance: BigNumber;
  allowance: BigNumber;
}

interface IStats {
  baseStats: ITokenStats;
  quoteStats: ITokenStats;
  ethBalance: BigNumber;
}

@observer
export class CreateMarket extends React.Component<ICreateMarketProps> {
  @observable private selectedTokenPair?: Dashboard.Api.ITokenPair;
  @observable private label = '';
  @observable private baseReserve?: ITokenReserveParams;
  @observable private quoteReserve?: ITokenReserveParams;
  @observable private stats?: IStats;
  @observable private minEthBalance = '';
  @observable private cancellationMode: 'hard' | 'soft' = 'hard';
  @observable private isSettingBaseAllowance = false;
  @observable private isSettingQuoteAllowance = false;
  @observable private confirmSetBaseAllowance = false;
  @observable private confirmSetQuoteAllowance = false;

  constructor(public readonly props: ICreateMarketProps) {
    super(props);

    autorun(() => {
      if (this.selectedTokenPair) {
        this.loadBalances(this.selectedTokenPair);
      }
    });
  }

  public render() {
    const onLabelChange: React.ChangeEventHandler<HTMLInputElement> = event => this.label = event.target.value;
    const minEthBalanceError = this.minEthBalanceError();
    return (
      <Modal onClose={this.props.onClose} title='Create Market' className='create-market'>
        <Form onSubmit={this.onSubmit}>
          <TextInput label={<span>Label <HoverTooltip tooltipContent='A human-readable name to describe this market' width='300px' /></span>} placeholder='Label' autoFocus={true} required={true}
            value={this.label} onChange={onLabelChange} />
          <Select label='Token Pair' onChange={this.onTokenPairChange} required={true}>
            <option value='' selected={true} disabled={true} hidden={true}>Select Token Pair</option>
            {tokenPairStore.tokenPairs.map((tp, i) => (
              <option key={i} value={i}>{tp.tokenA.symbol}/{tp.tokenB.symbol}</option>
            ))}
          </Select>
          {this.selectedTokenPair && this.stats && <div>
            {(this.stats.baseStats.allowance.isZero() || this.stats.quoteStats.allowance.isZero()) && <div className='error-box'>
              {this.stats.baseStats.allowance.isZero() && <div className='line-item'>
                <i className='fa fa-exclamation-circle' />
                <span> Insufficient {this.selectedTokenPair.tokenA.symbol} Allowance - </span>
                {this.isSettingBaseAllowance
                  ? <InlineLoader />
                  : <span className='link' onClick={this.onClickBaseAllowance}>FIX</span>}
              </div>}
              {this.stats.quoteStats.allowance.isZero() && <div className='line-item'>
                <i className='fa fa-exclamation-circle' />
                <span> Insufficient {this.selectedTokenPair.tokenB.symbol} Allowance - </span>
                {this.isSettingQuoteAllowance
                  ? <InlineLoader />
                  : <span className='link' onClick={this.onClickQuoteAllowance}>FIX</span>}
              </div>}
            </div>}
            <TokenReserveInput token={this.selectedTokenPair.tokenA} onChange={this.onTokenAReserveChange}
              stats={this.stats.baseStats} />
            <TokenReserveInput token={this.selectedTokenPair.tokenB} onChange={this.onTokenBReserveChange}
              stats={this.stats.quoteStats} />
            <div className='token-reserve-input'>
              <label className='title sb'>
                <span>Minimum Ether Balance <HoverTooltip tooltipContent='Minimum Ether amount to keep in reserve. If owned Ether dips below this amount, all open positions will be canceled.' width='300px' /></span>
                <span className='balance-container'>
                  <span className='uppercase balance-label'>Balance</span>
                  {toUnitAmount({ token: { decimals: 18 }, value: this.stats.ethBalance }).toFormat(4)}&nbsp;
                  (~{tickerStore.getTokenUsdEquivalent({ decimals: 18, symbol: 'WETH' }, this.stats.ethBalance)} USD)
                </span>
              </label>
            </div>
            <TextInput type='text' placeholder='Minimum Ether Balance'
              onChange={this.onMinEthBalanceChange} value={this.minEthBalance} required={true} errorMessage={minEthBalanceError.error}
              infoMessage={minEthBalanceError.value && <span>~{tickerStore.getTokenUsdEquivalent({ decimals: 18, symbol: 'WETH' }, minEthBalanceError.value)} USD</span>} />
            <div className='b-padding'>
              <label>Cancelation Mode</label>
              <div>
                <label>
                  <input type='radio' value='hard' checked={this.cancellationMode === 'hard'} onClick={this.handleModeSelect('hard')} />
                  <span>Hard Cancellation (costs gas, removed from blockchain)</span>
                </label>
                <label>
                  <input type='radio' value='soft' checked={this.cancellationMode === 'soft'} onClick={this.handleModeSelect('soft')} />
                  <span>Soft Cancellation (no gas costs, removes from ERC dEX UI)</span>
                </label>
              </div>
            </div>
            {this.confirmSetBaseAllowance && <EnterPassphraseModal message='Enter your account passphrase to set allowance'
              onClose={this.onCloseConfirmBaseAllowance} onSubmit={this.setBaseAllowance(this.stats, this.selectedTokenPair.tokenA)}
              submitText={`Set ${this.selectedTokenPair.tokenA.symbol} Allowance`} />}
            {this.confirmSetQuoteAllowance && <EnterPassphraseModal message='Enter your account passphrase to set allowance'
              onClose={this.onCloseConfirmQuoteAllowance} onSubmit={this.setQuoteAllowance(this.stats, this.selectedTokenPair.tokenB)}
              submitText={`Set ${this.selectedTokenPair.tokenB.symbol} Allowance`} />}
          </div>}
          <div>
            <button className='button primary fw' type='submit' disabled={!this.isValid()}>Submit</button>
          </div>
        </Form>
      </Modal>
    );
  }

  private readonly handleModeSelect = (mode: 'hard' | 'soft') => () => this.cancellationMode = mode;

  private onTokenPairChange: React.ChangeEventHandler<HTMLSelectElement> = event => {
    const index = parseInt(event.target.value, 10);
    if (!isNaN(index)) {
      this.selectedTokenPair = tokenPairStore.tokenPairs[index];
    }
  }

  private readonly onCloseConfirmBaseAllowance = () => this.confirmSetBaseAllowance = false;
  private readonly onClickBaseAllowance = () => this.confirmSetBaseAllowance = true;
  private setBaseAllowance = (stats: IStats, token: Dashboard.Api.IToken) => async (passphrase: string) => {
    try {
      this.isSettingBaseAllowance = true;
      await new Dashboard.Api.AccountsService().setUnlimitedAllowance({
        request: {
          tokenAddress: token.address,
          passphrase
        }
      });
      stats.baseStats.allowance = new BigNumber(1);
    } catch (err) {
      flashMessageStore.addMessage({ type: 'error', content: err.message });
    }

    this.isSettingBaseAllowance = false;
  }

  private readonly onCloseConfirmQuoteAllowance = () => this.confirmSetQuoteAllowance = false;
  private readonly onClickQuoteAllowance = () => this.confirmSetQuoteAllowance = true;
  private setQuoteAllowance = (stats: IStats, token: Dashboard.Api.IToken) => async (passphrase: string) => {
    try {
      this.isSettingQuoteAllowance = true;
      await new Dashboard.Api.AccountsService().setUnlimitedAllowance({
        request: {
          tokenAddress: token.address,
          passphrase
        }
      });
      stats.quoteStats.allowance = new BigNumber(1);
    } catch (err) {
      flashMessageStore.addMessage({ type: 'error', content: err.message });
    }

    this.isSettingQuoteAllowance = false;
  }

  private onTokenAReserveChange = (params?: ITokenReserveParams) => {
    this.baseReserve = params;
  }

  private onTokenBReserveChange = (params?: ITokenReserveParams) => {
    this.quoteReserve = params;
  }

  private onMinEthBalanceChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    this.minEthBalance = event.target.value;
  }

  private readonly onSubmit = async () => {
    if (!this.isValid() || !this.baseReserve || !this.quoteReserve) { return; }

    const { tokenA, tokenB } = this.selectedTokenPair as Dashboard.Api.ITokenPair;

    try {
      const baseRes = this.baseReserve;
      const quoteRes = this.quoteReserve;
      const minEthAmount = this.minEthBalanceError().value as BigNumber;

      const market = await new Dashboard.Api.MarketsService().create({
        request: {
          label: this.label,
          baseTokenSymbol: tokenA.symbol,
          quoteTokenSymbol: tokenB.symbol,
          minBaseAmount: baseRes.min,
          maxBaseAmount: baseRes.max,
          minQuoteAmount: quoteRes.min,
          maxQuoteAmount: quoteRes.max,
          minEthAmount: minEthAmount.toString(),
          cancellationMode: this.cancellationMode
        }
      });
      this.props.onSuccess(market);
      this.props.onClose();
    } catch (err) {
      flashMessageStore.addMessage({
        type: 'error',
        content: err.message || 'There was an error creating the market; please check your submission and try again.'
      });
    }
  }

  private isValid() {
    return !!(this.label && this.selectedTokenPair && this.baseReserve && this.quoteReserve && this.minEthBalanceError().value);
  }

  private async loadBalances(tokenPair: Dashboard.Api.ITokenPair) {
    const getTokenStats = async (tokenAddress: string) => {
      const stats = await new Dashboard.Api.AccountsService().getTokenStats({ tokenAddress });
      return {
        balance: new BigNumber(stats.balance),
        allowance: new BigNumber(stats.allowance)
      };
    };

    const baseStats = await getTokenStats(tokenPair.tokenA.address);
    const quoteStats = await getTokenStats(tokenPair.tokenB.address);
    const ethBalance = new BigNumber(await new Dashboard.Api.AccountsService().getEthBalance());

    this.stats = { baseStats, quoteStats, ethBalance };
  }

  private minEthBalanceError(): { empty?: boolean; error?: string; value?: BigNumber; } {
    if (!this.minEthBalance) { return { empty: true }; }
    if (!isValidFloat(this.minEthBalance)) { return { error: 'Please enter a valid number' }; }

    const value = toBaseUnitAmount({ token: { decimals: 18 }, value: this.minEthBalance });
    if (value.isGreaterThanOrEqualTo((this.stats as IStats).ethBalance)) {
      return { error: 'Insufficient balance' };
    }

    if (value.isLessThan(0)) {
      return { error: 'Must be a positive number' };
    }

    return { value };
  }
}
