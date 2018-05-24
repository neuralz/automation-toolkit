import { Dashboard } from 'api/api';
import * as classnames from 'classnames';
import { HoverTooltip } from 'common/hover-tooltip';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { IProcessedHealth, nodeHealthStore } from 'stores/node-health-store';
import * as request from 'superagent';
import './nav-bar.scss';
import { UpdateInstructions } from './update-instructions';

interface INavBarProps {
}

declare const TOOLKIT_VERSION: string;

const installedVersion = `${TOOLKIT_VERSION}`;

@observer
export class NavBar extends React.Component<INavBarProps> {
  @observable private newVersion?: string;
  @observable private isViewingUpdateInstructions = false;
  @observable private networkId?: number;

  constructor(public readonly props: INavBarProps) {
    super(props);
    this.load();
  }

  public render() {
    const getBlockLink = (networkId: number, blockNumber: string) => {
      return `https://${networkId === 42 ? 'kovan.' : ''}etherscan.io/block/${blockNumber}`;
    };

    const getNodeTooltip = (h: IProcessedHealth) => {
      return (
        <div>
          {h.message}

          <div className='t-margin list-header'>Troubleshooting Steps</div>
          <ul className='troubleshooting-list'>
            <li>Restart (Ctrl + C) the application process</li>
            <li>Restart the Docker Daemon</li>
            <li>As a last resort, remove the 'parity-data' folder - this will start a full sync</li>
            <li>Click 'Get Help' to open a support issue</li>
          </ul>
        </div>
      );
    };

    const health = nodeHealthStore.health;
    return (
      <div className='nav-bar'>
        <div className='fl vc sb'>
          <img src='/images/logo_dark.svg' className='logo' />
          <div className='fl right-menu'>
            {health && this.networkId && <div>
              {health.message !== 'ready' && <HoverTooltip tooltipContent={getNodeTooltip(health)}>
                <i className='danger fa fa-exclamation-circle' />
              </HoverTooltip>}
              <span className='version-label'>{this.networkId === 42 ? 'KOVAN' : 'MAINNET'} BLOCK </span>
              {typeof health.block !== 'undefined'
                ? <a target='_blank' href={getBlockLink(this.networkId, health.block)}>#{health.block}</a>
                : <span>Unknown</span>}
              <span className={classnames(health.raw.result.peers.status !== 'ok' && 'warning')}
              > [{health.peers[0]}/{health.peers[1]} Peers]</span>
              <span className='h-margin'>|</span>
            </div>}
            <div>
              <span className='version-label'>VERSION </span>
              <span>{installedVersion} </span>
              {this.newVersion && <a className='link update-link' onClick={this.onUpdateVersion}>
                [Update Available: {installedVersion} -> {this.newVersion}]
              </a>}
              <span className='l-margin'>|</span>
            </div>
            <div className='l-margin'>
              <a className='link' target='_blank' href='https://github.com/ERCdEX/automation-toolkit/issues/new?template=support-request.md'>Get Help</a>
            </div>
            <div className='l-margin'>
              <a className='link' target='_blank' href='https://github.com/ERCdEX/automation-toolkit'>Docs</a>
            </div>
          </div>
        </div>
        {this.isViewingUpdateInstructions && <UpdateInstructions onClose={this.onCloseInstructions} />}
      </div>
    );
  }

  private async load() {
    this.networkId = await new Dashboard.Api.MarketsService().getNetworkId();
    const version = await this.getLatestVersion();
    this.newVersion = version !== installedVersion ? version : undefined;
  }

  private async getLatestVersion() {
    return new Promise<string>((resolve, reject) => {
      request.get('https://raw.githubusercontent.com/ERCdEX/automation-toolkit/master/version.json', (err, res) => {
        if (err) {
          return reject(err);
        }

        const body = JSON.parse(res.text);
        resolve(body.version);
      });
    });
  }

  private readonly onCloseInstructions = () => this.isViewingUpdateInstructions = false;
  private readonly onUpdateVersion = () => this.isViewingUpdateInstructions = true;
}
