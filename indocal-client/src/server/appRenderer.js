import React from 'react';
import ReactDOM from 'react-dom/server';
import {createMemoryHistory} from 'history';
import {flushChunkNames} from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';

import Html from './templates';
import RootAppView from '../app/RootAppView';
import {getVendorChunkName} from '../../scripts/toolbelt';

function renderTemplate(page: string) {
  return `<!doctype html>${page}`;
}

export default function renderApp({clientStats}) {
  return function handleAppRender(req, res) {
    const history = createMemoryHistory({initialEntries: [req.path]});
    const chunkNames = flushChunkNames();
    const {scripts, stylesheets, publicPath} = flushChunks(clientStats, {
      chunkNames,
    });
    const vendorChunkName = getVendorChunkName(clientStats.assets);
    const markup = ReactDOM.renderToString(<RootAppView history={history} />);
    const page = ReactDOM.renderToString(
      <Html
        assetPath={publicPath}
        initialState={{}}
        scripts={[vendorChunkName, ...scripts]}
        stylesheets={stylesheets}
        markup={markup}
      />
    );
    res.send(renderTemplate(page));
  };
}
