// @flow

import React, {Component} from 'react';
import {SafeAreaView, View, Text} from 'react-native';
import codePush from 'react-native-code-push';

class Indocal extends Component {
  render() {
    return (
      <SafeAreaView>
        <View>
          <Text>Welcome to React Native!</Text>
        </View>
      </SafeAreaView>
    );
  }
}

export default codePush(Indocal);
