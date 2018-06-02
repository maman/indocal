// @flow

import React, {type Node} from 'react';
import {AppRegistry} from 'react-native';
/* eslint-disable-next-line */
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import {hot} from 'react-hot-loader';
import RootAppView from '../app/RootAppView';

export type WebApplication = {
  HMRApp: Node,
  styleElement: string,
};

type History = BrowserHistory | MemoryHistory;

export default function startWebApp(history: History): WebApplication {
  // perform web logic
  const HotAppView = hot(module)(RootAppView);
  const HMRApp = () => <HotAppView history={history} />;
  AppRegistry.registerComponent('indocal', () => HMRApp);
  const registeredApp = AppRegistry.getApplication('indocal');
  return {
    HMRApp,
    styleElement: !canUseDOM ? registeredApp.getStyleElement() : '',
  };
}
