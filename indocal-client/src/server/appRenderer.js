// @flow

import React from 'react';
import ReactDOM from 'react-dom/server';
/* eslint-disable-next-line */
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import {createMemoryHistory} from 'history';
import {clearChunks, flushChunkNames} from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';

import Html from './templates';
import startWebApp from '../client/startWebApp';
import routes from '../app/routes';
import {getVendorChunkName} from '../utils/toolbelt';

function renderTemplate(page: string) {
  return `<!doctype html>${page}`;
}

export default function renderApp({clientStats}) {
  return function handleAppRender(req, res) {
    const history = createMemoryHistory({initialEntries: [req.path]});
    const {HMRApp, styleElement, store} = startWebApp({
      history,
      routes,
      preloadState: {},
      isServer: canUseDOM,
    });
    const chunkNames = flushChunkNames();
    const {scripts, stylesheets, publicPath} = flushChunks(clientStats, {
      chunkNames,
    });
    const vendorChunkName = getVendorChunkName(clientStats.assets);
    const markup = ReactDOM.renderToString(<HMRApp />);
    const page = ReactDOM.renderToString(
      <Html
        assetPath={publicPath}
        initialState={store.getState()}
        scripts={[vendorChunkName, ...scripts]}
        stylesheets={stylesheets}
        styleElement={styleElement}
        markup={markup}
      />
    );
    res.send(renderTemplate(page));
  };
}
