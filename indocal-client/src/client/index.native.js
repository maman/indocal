// @flow

import React, {Component} from 'react';
import {SafeAreaView, View, Text, Platform} from 'react-native';
import RootAppView from '../app/RootAppView';
import codePush from 'react-native-code-push';

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

export default codePush(Indocal);
