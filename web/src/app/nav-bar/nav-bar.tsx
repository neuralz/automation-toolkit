import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
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

  constructor(public readonly props: INavBarProps) {
    super(props);
    this.load();
  }

  public render() {
    return (
      <div className='nav-bar'>
        <div className='fl vc sb'>
          <img src='/images/logo_dark.svg' className='logo' />
          <div className='fl right-menu'>
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
