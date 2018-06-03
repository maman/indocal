// @flow

import React, {Component} from 'react';
import {SafeAreaView, View} from 'react-native';
import {createMemoryHistory} from 'history';
import codePush from 'react-native-code-push';

import RootAppView from '../app/RootAppView';
import configureStore from '../app/configureStore';
import routes from '../app/routes';

function startNativeApp({preloadState}) {
  const history = createMemoryHistory();
  const store = configureStore({
    history,
    routes,
    preloadState,
  });
  const App = () => <RootAppView store={store} />;
  return App;
}

class Indocal extends Component {
  /* eslint-disable-next-line */
  render() {
    const App = startNativeApp({preloadState: {}});
    return (
      <SafeAreaView>
        <View>
          <App />
        </View>
      </SafeAreaView>
    );
  }
}

export default codePush(Indocal);
