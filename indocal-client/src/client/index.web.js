import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory';
import startWebApp from './startWebApp';

const history = createHistory();

const {HMRApp} = startWebApp(history);

ReactDOM.hydrate(<HMRApp />, document.getElementById('html'));
