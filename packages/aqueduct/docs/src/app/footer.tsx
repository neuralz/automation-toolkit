import * as React from 'react';

import './footer.scss';

interface IFooterProps {}

export class Footer extends React.Component<IFooterProps> {
  public render() {
    return (
      <div className='footer-container'>
        <div className='logo'>
          <img
            src='../images/light-logo.svg'
            style={{ width: '200px', height: '80px' }}
          />
        </div>
        <div className='footer-subcontainer'>
          <div className='left-container'>
            <h2>Connect with us:</h2>
            <div className='social-links'>
              <a href='https://github.com/ercdex/aqueduct'>
                <img className='icon' src='../images/icons/github-dark.svg' />
              </a>
              <a href='https://medium.com/ercdex'>
                <img className='icon' src='../images/icons/medium-dark.svg' />
              </a>
              <a href='https://www.linkedin.com/company/25075800/'>
                <img className='icon' src='../images/icons/linkedin-dark.svg' />
              </a>
              <a href='https://twitter.com/ercdex'>
                <img className='icon' src='../images/icons/twitter-dark.svg' />
              </a>

              <a href='https://join.slack.com/t/ercdex/shared_invite/enQtMzAyMDcxMjY2NTAwLTdlNzNmMmIwZDQzZWQ3N2NmYTM2ZTAwZTE1YjQ1NjcwMjk4ZjUwZTI1NmQ5ZGNiYWMyNmQ4MDcyNDhiNjI4N2U'>
                <img className='icon' src={'../images/icons/slack-dark.svg'} />
              </a>
            </div>
          </div>
          <div className='right-container'>
            <div className='links'>
              <div className='company-links'>
                <ul className='linksList'>
                  <li>
                    <a href='https://www.ercdex.com/company'>Team</a>
                  </li>
                  <li>
                    <a href='https://medium.com/ercdex'>Blog</a>
                  </li>
                  <li>
                    <a href='mailto:info@ercdex.com'>Contact</a>
                  </li>
                </ul>
              </div>
              <div className='legal-links'>
                <ul className='linksList'>
                  <li>
                    <a href='https://www.ercdex.com/legals/terms'>
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href='https://www.ercdex.com/legals/privacy'>Privacy</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className='copyright'>© 2018 ERC dEX, Inc. All Rights Reserved.</p>
        </div>
      </div>
    );
  }
}
