import React from 'react';
import {hot} from 'react-hot-loader';
import RootAppView from '../app/RootAppView';

export default function startJsApp(history) {
  // perform stuff, return react element
  const Indocal = () => <RootAppView history={history} />;
  return hot(module)(Indocal);
}
