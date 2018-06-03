// @flow

import React from 'react';
import {Platform} from 'react-native';
import {connect} from 'react-redux';
import universal from 'react-universal-component';

type Props = {
  page: string,
  isLoading: ?boolean,
};

let PageSwitcher;

if (Platform.OS === 'web') {
  const ComponentLoader = props =>
    import(/* webpackChunkName: '[request]' */ `./${props.page}`);

  const UniversalComponent = universal(ComponentLoader, {
    chunkName: props => props.page,
    resolve: props => require.resolveWeak(`./${props.page}`),
  });

  /* eslint-disable-next-line */
  PageSwitcher = ({page}: Props) => <UniversalComponent page={page} />;
} else {
  const {View, Text} = require('react-native');
  /* eslint-disable-next-line */
  PageSwitcher = ({page}: Props) => (
    <View>
      <Text>Dor</Text>
    </View>
  );
}

export default connect(({page}) => ({
  page,
}))(PageSwitcher);
