import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

import styles from './styles';
import { Button, Text } from '../common';
import { ErrorActions, AuthActions } from '../../actions';
import { HOME_LANG, ERROR_LANG, COLOR } from '../../constants';
import { isStatusSuccess, isStatusLoading } from '../../utils';

const notCatchErrMsgs = [
  '',
  'Wrong Current Password',
]

const invalidTokenErrMsg = 'Missing or invalid token';

const mapStateToProps = state => ({
  errorMsg: state.error,
  testStatus: state.status.test,
  logoutStatus: state.status.logout,
});
const mapDispatchToProps = dispatch => ({
  resetError: () => dispatch(ErrorActions.resetError()),
  test: () => dispatch(ErrorActions.test()),
  logout: () => dispatch(AuthActions.logout()),
});

class Home extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    errorMsg: PropTypes.string,
    testStatus: PropTypes.string.isRequired,
    logoutStatus: PropTypes.string.isRequired,
    resetError: PropTypes.func.isRequired,
    test: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
  };
  static navigationOptions = {
    title: HOME_LANG.TITLE,
  };

  componentWillReceiveProps(nextProps) {
    const { navigation, errorMsg, testStatus, logoutStatus } = this.props;
    if (errorMsg === '' && notCatchErrMsgs.indexOf(nextProps.errorMsg) === -1) {
      navigation.popToTop();
      navigation.navigate('Home');
      navigation.setParams({ onError: true });
    }

    if (isStatusSuccess(testStatus, nextProps.testStatus)) {
      navigation.setParams({ onError: false });
    }

    if (isStatusSuccess(logoutStatus, nextProps.logoutStatus)) {
      navigation.replace('Landing');
    }
  }

  _handleManagePress = () => {
    this.props.navigation.navigate('Manage');
  }

  _handleQuizPress = () => {
    this.props.navigation.navigate('Quiz');
  }

  _handleTryAgainPress = () => {
    const { errorMsg, resetError, test, logout } = this.props;
    if (errorMsg === invalidTokenErrMsg) {
      logout();
    } else {
      resetError();
      test();
    }
  }

  _renderError() {
    const { errorMsg, testStatus } = this.props;
    const iconName = errorMsg === 'No Connection' ? 'close-network' : 'emoticon-dead';
    const msg = errorMsg === 'No Connection' ?
      ERROR_LANG.NETWORK_CONNECTION_ERROR
      :
      `${ERROR_LANG.INTERNAL_ERROR}\nErrCode: ${errorMsg}`;
    return (
      <View style={styles.container}>
        <View style={styles.msgWrapper}>
          <MaterialCommunityIcons name={iconName} size={70} color={COLOR.GOVERNOR_BAY} />
          <Text style={[styles.msgText, styles.msgLargeText]}>OOPS!!</Text>
          <Text style={styles.msgText}>{msg}</Text>
        </View>
        <View style={styles.btnTryWrapper}>
          <Button
            style={styles.btnTry}
            onPress={this._handleTryAgainPress}
          > 
            {isStatusLoading(testStatus) ?
              <ActivityIndicator />
              :
              <Text style={styles.btnTryText}>
                {errorMsg === invalidTokenErrMsg ?
                  'LOGOUT'
                  :
                  ERROR_LANG.TRY
                }
              </Text>
            }
          </Button>
        </View>
      </View>
    );
  }

  _renderContent() {
    return (
      <View style={styles.btnContainer}>
        <Button
          style={[styles.btn, { backgroundColor: COLOR.WHITE }]}
          onPress={this._handleQuizPress}
        >
          <View style={styles.btnTextWrapper}>
            <Text style={[styles.btnText, { color: COLOR.BLACK }]}>{HOME_LANG.PLAY}</Text>
            <Feather style={styles.btnIcon} name='play' size={70} color={COLOR.VIOLET}/>
          </View>
        </Button>
        <View style={[styles.btn, { backgroundColor: COLOR.VIOLET }]}>
          <Button
            style={styles.btnTextWrapper}
            onPress={this._handleManagePress}
          >
            <Text style={[styles.btnText, { color: COLOR.WHITE }]}>{HOME_LANG.MANAGER}</Text>
            <Feather style={styles.btnIcon} name='copy' size={70} color={COLOR.WHITE} />
          </Button>
        </View>
      </View>
    );
  }

  render() {
    const { errorMsg, testStatus } = this.props;
    return !errorMsg && !isStatusLoading(testStatus) ?
      this._renderContent()
      :
      this._renderError();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
