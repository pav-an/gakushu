import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, ViewPropTypes } from 'react-native';

export default class AppLoading extends Component {
  static propTypes = {
    style: ViewPropTypes.style,
  };

  render() {
    const { style } = this.props;
    return (
      <View style={[styles.container, style]}>
        <ActivityIndicator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
