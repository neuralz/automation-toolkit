import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './about.scss';

const getParameterByName = (name: string) => {
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(window.location.href);
  if (!results) { return null; }
  if (!results[2]) { return ''; }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

ReactDOM.render((
  <div className='container'>
    <div>
      <div className='icon-container'>
        <img src='./images/logo.png' />
      </div>
      <div className='name'>
        ERC dEX Automation Toolkit v{getParameterByName('version')}
      </div>
      <a target='_blank' href='https://github.com/ERCdEX/automation-toolkit'>https://github.com/ERCdEX/automation-toolkit</a>
    </div>
  </div>
), document.getElementById('app'));
