import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import './about.scss';
import { Dashboard } from './api/api';
import { App } from './app/app';
import './index.scss';

Dashboard.Initialize({ host: 'localhost:8662' });

const getParameterByName = (name: string) => {
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(window.location.href);
  if (!results) { return null; }
  if (!results[2]) { return ''; }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

const getAppContent = () => {
  if (getParameterByName('mode') === 'about') {
    return (
      <div className='container'>
        <div>
          <div className='icon-container'>
            <img src='images/logo.png' />
          </div>
          <div className='name'>
            ERC dEX Automation Toolkit v{getParameterByName('version')}
          </div>
          <a target='_blank' href='https://github.com/ERCdEX/automation-toolkit'>https://github.com/ERCdEX/automation-toolkit</a>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <App />
    </HashRouter>
  );
};

ReactDOM.render(getAppContent(), document.getElementById('app'));
