import React from 'react';
import { Provider } from 'react-redux';
import { View, YellowBox } from 'react-native';
import { createAppContainer } from 'react-navigation';
import * as Font from 'expo-font';
import Constants from 'expo-constants';

import configureStore from './store/configure-store';
import AppNavigator from './app-navigator';
import { AppLoading } from './components/common';
import { APP_CONST } from './constants';

YellowBox.ignoreWarnings([
  'Warning: componentWillReceiveProps',
  'Warning: componentWillMount',
  'Warning: Async Storage',
  'THREE.WebGLRenderer',
  'Remote debugger',
]);

const store = configureStore({});
const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  state = { assetsLoaded: false };

  componentWillMount() {
    this._loadAsset();
  }

  _loadAsset = async () => {
    await Font.loadAsync(APP_CONST.DEFAULT_FONT, require('../assets/fonts/meiryo.ttf'));
    this.setState({ assetsLoaded: true });
  }

  render() {
    const paddingTop = Constants.statusBarHeight;
    return (
      this.state.assetsLoaded ?
        <Provider store={store}>
          <View style={{ flex: 1, paddingTop }}>
            <AppContainer />
          </View>
        </Provider>
        :
        <AppLoading style={{ paddingTop }} />
    );
  }
}
