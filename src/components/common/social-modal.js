import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Dimensions, Animated, Easing, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { Entypo } from '@expo/vector-icons';

import config from '../../config';
import Button from './button';
import { COLOR } from '../../constants';

const WINDOW_HEIGHT = Dimensions.get('window').height;

export default class Social extends Component {
  static propTypes = {
    onSuccess: PropTypes.func.isRequired,
  };

  state = {
    provider: '',
    isLoading: false,
  }

  yValue = new Animated.Value(WINDOW_HEIGHT);

  open = provider => {
    this.setState({ provider });
    this._animate(0);
  }

  close = () => {
    this._animate(WINDOW_HEIGHT);
  };

  _animate = value => {
    Animated.timing(this.yValue, {
      toValue: value,
      duration: 200,
      easing: Easing.inout,
      useNativeDriver: true,
    }).start();
  }

  _handleOnMessage = e => {
    this.props.onSuccess(e.nativeEvent.data);
    this.close();
  }

  _handleClosePress = () => {
    this.setState({ provider: '' });
    this.close();
  }

  _renderLoading = () => {
    return <ActivityIndicator />;
  }

  render() {
    const { isLoading, provider } = this.state;
    return (
      <Animated.View style={[
        styles.container,
        { transform: [{ translateY: this.yValue }] },
      ]}>
        <Button
          onPress={this._handleClosePress}
          style={styles.btnClose}
        >
          <Entypo name='cross' size={40} />
        </Button>
        {provider !== '' &&
          <WebView
            key={provider}
            source={{ uri: config.API_URL + '/auth/' + provider }}
            renderLoading={this._renderLoading}
            onLoadStart={() => this.setState({ isLoading: true })}
            onLoad={e => {
              console.log(e.nativeEvent.url)
              this.setState({ isLoading: false })}
            }
            onMessage={this._handleOnMessage}
            incognito={true}
            style={styles.webView}
          />
        }
        {isLoading &&
          <View style={styles.overlay}>
            <ActivityIndicator color={COLOR.WHITE} size='large' />
          </View>
        }
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    margin: 20,
    borderWidth: 2,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.1,
    backgroundColor: COLOR.BLACK,
  },
  btnClose: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    top: -20,
    right: -20, 
    zIndex: 1,
    borderWidth: 3,
    borderColor: COLOR.BLACK,
    borderRadius: 25,
    backgroundColor: COLOR.WHITE,
  },
});
