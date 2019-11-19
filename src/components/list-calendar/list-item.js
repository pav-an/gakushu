import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import styles from './styles';
import { Button, Text } from '../common';
import { CALENDAR_LANG, COLOR } from '../../constants';
import { to2Digit } from '../../utils'

class CalendarDate extends PureComponent {
  static propTypes = {
    time: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  };

  _renderDaysOfWeek = () => {
    const { time } = this.props;
    const activeDoW = time.split(',');
    return CALENDAR_LANG.DOW_SHORTS.map((day, i) => {
      const activeStyle = activeDoW.indexOf(day) !== -1 ? COLOR.BLUE : COLOR.LAVENDER_GRAY;
      return (
        <Text
          key={i}
          style={[styles.itemTimeText, { color: activeStyle }]}
        >
          {CALENDAR_LANG.DOW_SYMBOLS[ i ]}
        </Text>
      );
    })
  }

  _renderDate = () => {
    return <Text style={styles.itemTimeText}>
      {this.props.time}
    </Text>
  }

  render() {
    return <View style={styles.itemTimeWraper}>
      {this.props.type === 'days_of_week' ?
        this._renderDaysOfWeek()
        :
        this._renderDate()
      }
    </View>
  }
}

class CalendarItem extends PureComponent {
  static propTypes = {
    calendar: PropTypes.object.isRequired,
    onPressDelete: PropTypes.func.isRequired,
  };

  _handleDeletePress = () => {
    this.props.onPressDelete(this.props.calendar.id);
  }

  render() {
    const { calendar } = this.props;
    const hourMin = `${to2Digit(calendar.hour)}:${to2Digit(calendar.min)}`
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemBody}>
          <Text style={styles.itemHourMinText}>
            {hourMin}
          </Text>
          <CalendarDate
            time={calendar.time}
            type={calendar.type}
          />
        </View>
        <Button
          style={styles.btnDelete}
          onPress={this._handleDeletePress}
        >
          <FontAwesome name="trash" size={35} color={COLOR.TAMARILLO} />
        </Button>
      </View>
    )
  }
}

export default class CalendarList extends PureComponent {
  static propTypes = {
    list: PropTypes.array.isRequired,
    onPressDelete: PropTypes.func.isRequired,
  }

  _keyExtractor = item => item.id;

  _renderItem = ({ item }) => {
    return <CalendarItem
      calendar={item}
      onPressDelete={this.props.onPressDelete}
    />
  }

  render() {
    return (
      <FlatList
        data={this.props.list}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        style={styles.flatList}
      />
    )
  }
}
