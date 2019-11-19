import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Slider from 'react-native-slider';

import styles from './styles';
import { Text } from '../common';
import { QUESTION_LANG, COLOR } from '../../constants';

export default class Diffculty extends Component {
  static propTypes = {
    value: PropTypes.number.isRequired,
    onChangeValue: PropTypes.func.isRequired,
  }

  render() {
    const { value, onChangeValue } = this.props;
    return (
      <View style={styles.diffContainer}>
        <Text style={styles.diffTextDescript}>{QUESTION_LANG.DIFFICULTY}</Text>
        <Text style={styles.diffTextValue}>{value}</Text>
        <View style={{ flex: 1 }}>
          <Slider
            value={value}
            onValueChange={val => onChangeValue(val)}
            step={1}
            minimumValue={0}
            maximumValue={10}
            thumbTintColor={COLOR.WHITE}
            minimumTrackTintColor={COLOR.LIGHT_GREEN}
            maximumTrackTintColor={COLOR.POLO_BULE}
          />
        </View>
      </View>
    );
  }
}
