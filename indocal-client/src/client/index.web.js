import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory';
import {AppContainer} from 'react-hot-loader';
import RootAppView from '../app/RootAppView';

const history = createHistory();

function startJsApp(App) {
  return ReactDOM.hydrate(
    <AppContainer>
      <App history={history} />
    </AppContainer>,
    document.getElementById('html')
  );
}

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('../app/RootAppView.js', () => {
    const App = require('../app/RootAppView').default;
    startJsApp(App);
  });
}

startJsApp(RootAppView);
