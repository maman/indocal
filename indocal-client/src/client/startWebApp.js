// @flow

import React, {type Node} from 'react';
import {AppRegistry} from 'react-native';
import {hot} from 'react-hot-loader';

import configureStore from '../app/configureStore';
import RootAppView from '../app/RootAppView';

import type {Store} from 'redux';

export type WebApplication = {
  HMRApp: Node,
  styleElement: string,
  store: Store,
};

type History = BrowserHistory | MemoryHistory;

type webAppOptions = {
  history: History,
  routes: any,
  preloadState: any,
  isServer: boolean,
};

export default function startWebApp({
  history,
  routes,
  preloadState,
  isServer,
}: webAppOptions): WebApplication {
  const store = configureStore({
    history,
    routes,
    preloadState,
  });
  const HotAppView = hot(module)(RootAppView);
  const HMRApp = () => <HotAppView store={store} />;
  const result = {HMRApp, store};
  if (isServer) {
    AppRegistry.registerComponent('indocal', () => HMRApp);
    const registeredApp = AppRegistry.getApplication('indocal');
    return {
      ...result,
      styleElement: registeredApp.getStyleElement(),
    };
  }
  return {...result, styleElement: ''};
}
