import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Dashboard } from './api/api';
import { App } from './app/app';
import './index.scss';

Dashboard.Initialize({ host: 'localhost:8662' });

ReactDOM.render((
  <HashRouter>
    <App />
  </HashRouter>
), document.getElementById('app'));
