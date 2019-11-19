import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Keyboard, Platform, DatePickerAndroid, DatePickerIOS, Animated, Dimensions, Easing, StyleSheet } from 'react-native';

import Button from './button';
import Text from './text';
import { COLOR, COMMON_LANG } from '../../constants';

const WINDOW_HEIGHT = Dimensions.get('window').height;

export default class DatePicker extends Component {
  static propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    onChangeDate: PropTypes.func.isRequired,
    minDate: PropTypes.instanceOf(Date).isRequired,
    maxDate: PropTypes.instanceOf(Date).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      tempDate: props.date,
    };
  }

  yValue = new Animated.Value(WINDOW_HEIGHT);

  open = async () => {
    if (Platform.OS === 'ios') {
      this.setState({ tempDate: this.props.date });
      this._handleOpen();
      return;
    }
    const { date, minDate, maxDate, onChangeDate } = this.props;
    const { action, year, month, day } = await DatePickerAndroid.open({
      minDate,
      maxDate,
      date,
    });
    if (action === DatePickerAndroid.dateSetAction) {
      onChangeDate(new Date(year, month, day));
    }
  }

  _animate = value => {
    Animated.timing(this.yValue, {
      toValue: value,
      duration: 200,
      easing: Easing.inout,
      useNativeDriver: true,
    }).start();
  }
  
  _handleOpen = () => {
    Keyboard.dismiss();
    this._animate(0);
  };
  
  _handleClose = () => {
    this._animate(WINDOW_HEIGHT);
  };
  
  _handleSetDate = () => {
    this.props.onChangeDate(this.state.tempDate);
    this._handleClose();
  }

  render() {
    if (Platform.OS === 'android') {
      return null;
    }
    const { minDate, maxDate } = this.props;
    const { tempDate } = this.state;
    return (
      <Animated.View style={[
        styles.container,
        { transform: [{ translateY: this.yValue }] },
      ]}>
        <Button
          onPress={this._handleClose}
          style={{ flex: 1 }}
        />
        <DatePickerIOS
          mode='date'
          date={tempDate}
          onDateChange={tempDate => this.setState({ tempDate })}
          minimumDate={minDate}
          maximumDate={maxDate}
          style={styles.datePicker}
        />
        <View style={styles.btnWrapper}>
          <Button
            onPress={this._handleClose}
            style={[ styles.btn, styles.btnWhite ]}
          >
            <Text style={[ styles.textBtn, styles.textBtnWhite ]}>{COMMON_LANG.CANCEL}</Text>
          </Button>
          <Button
            onPress={this._handleSetDate}
            style={styles.btn}
          >
            <Text style={styles.textBtn}>{COMMON_LANG.SET}</Text>
          </Button>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  datePicker: {
    backgroundColor: COLOR.WHITE,
  },
  btnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: COLOR.WHITE,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    padding: 10,
    borderRadius: 50,
    backgroundColor: COLOR.GOVERNOR_BAY,
  },
  textBtn: {
    fontSize: 15,
    color: COLOR.WHITE,
  },
  btnWhite: {
    borderWidth: 3,
    borderColor: COLOR.GOVERNOR_BAY,
    backgroundColor: COLOR.WHITE,
  },
  textBtnWhite: {
    color: COLOR.GOVERNOR_BAY,
  },
});
