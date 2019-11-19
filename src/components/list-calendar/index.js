import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import * as Permissions from 'expo-permissions';
import { AntDesign } from '@expo/vector-icons';

import styles from './styles';
import ListItem from './list-item'
import { NavBar, Button, Text } from '../common';
import { CalendarActions } from '../../actions';
import { LIST_CALENDAR_LANG } from '../../constants';
import { isStatusSuccess, isStatusLoading } from '../../utils';
import getPermission from '../../utils/get-permission';
import LocalCalendar from '../../utils/local-calendar';

const mapStateToProps = state => ({
  list: state.calendars,
  listStatus: state.status.listCalendar,
  uploadStatus: state.status.uploadCalendar,
  removeStatus: state.status.removeCalendar,
});
const mapDispatchToProps = dispatch => ({
  listCalendar: () => dispatch(CalendarActions.listCalendar()),
  uploadCalendar: data => dispatch(CalendarActions.uploadCalendar(data)),
  removeCalendar: calendarId => dispatch(CalendarActions.removeCalendar(calendarId)),
});

class ListCalendar extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    list: PropTypes.array.isRequired,
    listStatus: PropTypes.string.isRequired,
    uploadStatus: PropTypes.string.isRequired,
    removeStatus: PropTypes.string.isRequired,
    listCalendar: PropTypes.func.isRequired,
    uploadCalendar: PropTypes.func.isRequired,
    removeCalendar: PropTypes.func.isRequired,
  };
  static navigationOptions = {
    title: LIST_CALENDAR_LANG.TITLE,
  };

  state = {
    havePermission: true,
  }

  componentDidMount() {
    this._askCalendarPermission();
  }

  componentWillReceiveProps(nextProps) {
    const { list, listStatus, uploadStatus, removeStatus } = this.props;

    if (isStatusSuccess(listStatus, nextProps.listStatus)
      || isStatusSuccess(uploadStatus, nextProps.uploadStatus)
      || isStatusSuccess(removeStatus, nextProps.removeStatus)) {
      LocalCalendar.reconciliation(list);
    }
  }

  _askCalendarPermission = async () => {
    const res = await getPermission(Permissions.CALENDAR);
    this.setState({ havePermission: res });
    if (res) {
      this.props.listCalendar();
    }
  }

  _handleAddPress = () => {
    this.props.navigation.navigate('Calendar');
  }

  _onPressDelete = calendarId => {
    this.props.removeCalendar(calendarId);
  }

  render() {
    const { list, listStatus } = this.props;
    const title = `(${list.length}) ${LIST_CALENDAR_LANG.TITLE}`
    if (!this.state.havePermission) {
      return (
        <View style={styles.container}>
          <Text>{LIST_CALENDAR_LANG.REQUIRE_PREMISSION}</Text>
        </View>  
      )
    }
    return (
      <View style={styles.container}>
        <NavBar
          navigation={this.props.navigation}
          title={title}
        />
        {isStatusLoading(listStatus) ?
          <ActivityIndicator />
          :
          <ListItem
            list={list}
            onPressDelete={this._onPressDelete}
          />
        }
        <Button
          style={styles.addBtn}
          onPress={this._handleAddPress}
        >
          <AntDesign name='pluscircleo' size={50} />
        </Button>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListCalendar);
