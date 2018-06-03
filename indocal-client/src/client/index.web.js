import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory';
import startWebApp from './startWebApp';
import routes from '../app/routes';

const history = createHistory();

const {HMRApp} = startWebApp({
  history,
  routes,
  preloadState: window.__INITIAL_STATE__,
  isServer: false,
});

ReactDOM.hydrate(<HMRApp />, document.getElementById('html'));
