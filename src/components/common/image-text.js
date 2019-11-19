import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, View, StyleSheet, ScrollView } from 'react-native';

import Text from './text';
import { isStatusLoading } from '../../utils';
import { COLOR } from '../../constants';

export default class ImageText extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    status: PropTypes.string,
    containerStyle: PropTypes.any,
    aspectRatio: PropTypes.number,
    fontSize: PropTypes.number,
  };

  render() {
    let { text, containerStyle, aspectRatio, fontSize, status } = this.props;
    aspectRatio = aspectRatio || 1.33;
    fontSize = fontSize || 18;

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={[styles.wrapper, { aspectRatio }]}>
          {isStatusLoading(status) ?
            <ActivityIndicator />
            :
            <ScrollView>
              <Text
                style={[styles.text, { fontSize }]}
                ellipsizeMode='tail'
              >
                {text}
              </Text>
            </ScrollView>
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.VIOLET,
    flexDirection: 'row',
    padding: 5,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: COLOR.WHITE,
  },
});
