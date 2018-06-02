import React from 'react';
import {hot} from 'react-hot-loader';
import RootAppView from '../app/RootAppView';

export default function startJsApp(history) {
  const HotAppView = hot(module)(RootAppView);
  return <HotAppView history={history} />;
}
