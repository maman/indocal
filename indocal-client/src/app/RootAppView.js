// @flow

import React, {Component, type Node} from 'react';
import {Provider} from 'react-redux';
import PageSwitcher from './PageSwitcher';

import type {Store} from 'redux';

type Props = {
  store: Store,
  currentPage: Node,
};

export default class RootAppView extends Component<Props> {
  render() {
    return (
      <Provider store={this.props.store}>
        <PageSwitcher />
      </Provider>
    );
  }
}
