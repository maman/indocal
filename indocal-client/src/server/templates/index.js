// @flow

import React, {Component} from 'react';

type Props = {
  assetPath: string,
  initialState: Object,
  scripts: string[],
  stylesheets: string[],
  markup: string,
  styleElement: string,
};

export default class HTML extends Component<Props> {
  render() {
    const {
      assetPath,
      initialState,
      scripts,
      stylesheets,
      markup,
      styleElement,
    } = this.props;
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-dns-prefetch-control" content="on" />
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1.0"
          />
          {styleElement}
          {stylesheets.map((stylesheet: string, i: number) => (
            <link
              href={`${assetPath}/${stylesheet}`}
              rel="stylesheets"
              key={i}
            />
          ))}
        </head>
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__INITIAL_STATE__ = ${JSON.stringify(
                initialState
              )}`,
            }}
          />
          <noscript>Server-rendered:</noscript>
          <div id="html" dangerouslySetInnerHTML={{__html: markup}} />
          {scripts.map((script: string, i: number) => (
            <script src={`${assetPath}/${script}`} key={i} />
          ))}
        </body>
      </html>
    );
  }
}
