// @flow

import React, {Component} from 'react';
import {SafeAreaView, View, Text, Platform} from 'react-native';
import RootAppView from '../app/RootAppView';

const IS_WEB = Platform.OS === 'web';

/** UNSAFE */
let codePush;
if (!IS_WEB) codePush = require('react-native-code-push');

class Indocal extends Component {
  render() {
    return (
      <SafeAreaView>
        <View>
          <RootAppView />
        </View>
      </SafeAreaView>
    );
  }
}

export default (IS_WEB ? Indocal : codePush(Indocal));
