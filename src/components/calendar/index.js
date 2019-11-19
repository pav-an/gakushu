import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Picker, Easing, Animated, ActivityIndicator, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { Calendar as WixCalendar } from 'react-native-calendars';
import moment from 'moment';

import styles from './styles';
import { NavBar, Button, Text } from '../common';
import { CalendarActions } from '../../actions';
import { CALENDAR_LANG, COLOR, DATE_FORMAT, COMMON_LANG } from '../../constants';
import { to2Digit, isStatusSuccess, isStatusLoading } from '../../utils';

const mapStateToProps = state => ({
  uploadStatus: state.status.uploadCalendar,
});
const mapDispatchToProps = dispatch => ({
  uploadCalendar: data => dispatch(CalendarActions.uploadCalendar(data)),
});

const WIX_DATE_STYLE = { selected: true, selectedColor: 'blue' };

class Calendar extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    uploadStatus: PropTypes.string.isRequired,
    uploadCalendar: PropTypes.func.isRequired,
  };

  answerYValue = new Animated.Value(0);
  todayDate = new Date();
  calendarId = '';

  state = {
    date: '', // YYYY-MM-DD
    tmpDate: '',
    hour: 6,
    min: 0,
    activeDoW: {},
  };

  constructor(props) {
    super(props);
    this.state.date = moment().add(1, 'days').format(DATE_FORMAT);
  }

  componentWillReceiveProps(nextProps) {
    const { navigation, uploadStatus } = this.props;
    if (isStatusSuccess(uploadStatus, nextProps.uploadStatus)) {
      navigation.goBack(null);
    }
  }

  _handleContainerOnLayout = event => {
    this.containerHeight = event.nativeEvent.layout.height;
    this.answerYValue.setValue(this.containerHeight);
    this.forceUpdate();
  }

  _handleWixCalendarPress = day => {
    this.setState({ tmpDate: day.dateString });
  }

  _handleDatePickerCancelPress = () => {
    this._animateDatePicker(this.containerHeight);
  }

  _handleDatePickerDonePress = () => {
    this.setState(state => ({
      date: state.tmpDate,
    }));
    this._animateDatePicker(this.containerHeight);
  }

  _animateDatePicker = value => {
    if (this.isAnswerAnimating) {
      return;
    }
    this.isAnswerAnimating = true;
    Animated.timing(
      this.answerYValue,
      {
        toValue: value,
        duration: 250,
        easing: Easing.inout,
        useNativeDriver: true,
      }
    ).start(() => {
      this.isAnswerAnimating = false;
    })
  }

  _handleDOWPress = day => {
    this.setState(state => ({
      date: '',
      activeDoW: {
        ...state.activeDoW,
        [ day ]: !state.activeDoW[ day ],
      },
    }))
  }

  _handleSavePress = () => {
    const { hour, min, date, activeDoW } = this.state;
    const data = {
      id: this.calendarId,
      hour,
      min,
    };
    if (date) {
      data.type = 'date';
      data.time = date;
    } else {
      data.type = 'days_of_week';
      data.time = Object.keys(activeDoW).filter(doW => activeDoW[ doW ]).join(',');
    }
    this.props.uploadCalendar(data);
  }

  _renderNavbar = () => {
    const { navigation, uploadStatus } = this.props;
    return (
      <NavBar
        navigation={navigation}
        title={CALENDAR_LANG.TITLE}
      >
        <Button
          style={styles.saveBtn}
          onPress={this._handleSavePress}
          status={uploadStatus}
        >
          {isStatusLoading(uploadStatus) ?
            <ActivityIndicator />
            :
            <FontAwesome name='save' size={35} color={COLOR.TAMARILLO} />
          }
        </Button>
      </NavBar>
    );
  }

  _renderStatusBar = () => {
    const { date, activeDoW } = this.state;
    let text;
    if (date) {
      text = date;
    } else {
      const dayLabels = [];
      CALENDAR_LANG.DOW_SHORTS.forEach((day, i) => {
        if (activeDoW[ day ]) {
          dayLabels.push(CALENDAR_LANG.DOW_LABELS[ i ]);
        }
      })
      text = dayLabels.join(', ');
    }
    return (
      <View style={styles.statusBarContainer}>
        <Text style={styles.textStatusBar}>
          {text}
        </Text>
        <Button
          style={styles.btnStatusBar}
          onPress={this._animateDatePicker.bind(this, 0)}
          delayTime={250}
        >
          <AntDesign name='calendar' size={32} />
          <Text style={styles.textBtnStatusBar}>{CALENDAR_LANG.DATE}</Text>
        </Button>
      </View>
    );
  }

  _renderDatePicker = () => {
    if (!this.containerHeight) {
      return null;
    }
    const { width: windowWidth } = Dimensions.get('window');
    return (
      <Animated.View style={[
        styles.datePickerContainer,
        { transform: [{ translateY: this.answerYValue }] },
      ]}>
        <Button
          onPress={this._handleDatePickerCancelPress}
          style={styles.fillDatePicker}
        />
        <View style={styles.datePicker}>
          <WixCalendar
            minDate={this.todayDate}
            style={[styles.wixCalendar, { width: windowWidth - 40 }]}
            markedDates={{ [ this.state.tmpDate ]: WIX_DATE_STYLE }}
            onDayPress={this._handleWixCalendarPress}
          />
          <View style={styles.btnDatePickerWrapper}>
            <Button
              style={[ styles.btnDatePicker, styles.btnWhite ]}
              onPress={this._handleDatePickerCancelPress}
            >
              <Text style={[ styles.textBtnDatePicker, styles.textBtnWhite ]}>{COMMON_LANG.CANCEL}</Text>
            </Button>
            <Button
              style={styles.btnDatePicker}
              onPress={this._handleDatePickerDonePress}
            >
              <Text style={styles.textBtnDatePicker}>{COMMON_LANG.DONE}</Text>
            </Button>
          </View>
        </View>
      </Animated.View>
    )
  }

  _renderRepeat = () => {
    const dowBtns = CALENDAR_LANG.DOW_SHORTS.map((day, i) => {
      const isActive = this.state.activeDoW[ day ];
      const activeBtnStyle = isActive ? {
        borderColor: COLOR.GOVERNOR_BAY,
      } : null;
      const activeTextStyle = isActive ? {
        color: COLOR.GOVERNOR_BAY,
        fontWeight: 'bold',
      } : null;
      return (
        <Button
          key={i}
          style={[styles.btnDOW, activeBtnStyle]}
          onPress={this._handleDOWPress.bind(this, day)}
        >
          <Text style={[styles.textBtnDOW, activeTextStyle]}>
            {CALENDAR_LANG.DOW_SYMBOLS[ i ]}
          </Text>
        </Button>
      )
    })
    return (
      <View style={styles.repeatContainer}>
        <Text style={styles.textRepeat}>{CALENDAR_LANG.REPEAT}</Text>
        <View style={styles.dowBtnsWrapper}>{dowBtns}</View>
      </View>
    );
  }

  _renderHourMinPicker = () => {
    const minPickerItems = [];
    const hourPickerItems = [];
    for (let i = 0; i < 60; i++) {
      minPickerItems.push(<Picker.Item key={i} label={to2Digit(i)} value={i} />);
    }
    for (let i = 0; i < 24; i++) {
      hourPickerItems.push(<Picker.Item key={i} label={to2Digit(i)} value={i} />);
    }

    return (
      <View style={styles.hourMinPickerContainer}>
        <View style={[styles.hourPickerWrapper, { alignItems: 'flex-end' }]}>
          <Picker
            mode='dropdown'
            style={styles.hourPicker}
            selectedValue={this.state.hour}
            onValueChange={hour =>
              this.setState({ hour })
            }
          >
            {hourPickerItems}
          </Picker>
        </View>
        <View style={styles.hourPickerWrapper}>
          <Picker
            mode='dropdown'
            style={styles.hourPicker}
            selectedValue={this.state.min}
            onValueChange={min => {
              this.setState({ min });
            }}
          >
            {minPickerItems}
          </Picker>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View
        style={styles.container}
        onLayout={this._handleContainerOnLayout}
      >
        {this._renderNavbar()}
        {this._renderStatusBar()}
        {this._renderHourMinPicker()}
        {this._renderRepeat()}
        {this._renderDatePicker()}
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
