import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';

import styles from './styles';
import { AppLoading, Button, Text } from '../common';
import { AuthActions, ErrorActions } from '../../actions';
import { isStatusLoading, isStatusSuccess } from '../../utils';
import { LANDING_LANG } from '../../constants';

const mapStateToProps = state => ({
  tokenStatus: state.status.getLocalToken,
  loginStatus: state.status.login,
});
const mapDispatchToProps = dispatch => ({
  resetError: () => dispatch(ErrorActions.resetError()),
  getLocalToken: () => dispatch(AuthActions.getLocalToken()),
});

class Landing extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    tokenStatus: PropTypes.string.isRequired,
    loginStatus: PropTypes.string.isRequired,
    resetError: PropTypes.func.isRequired,
    getLocalToken: PropTypes.func.isRequired,
  };

  componentDidMount () {
    this.props.resetError();
    this.props.getLocalToken();
  }

  componentWillReceiveProps(nextProps) {
    const { tokenStatus, loginStatus, navigation } = this.props;
    if (isStatusSuccess(tokenStatus, nextProps.tokenStatus)) {
      navigation.replace('Main');
    }
    if (isStatusSuccess(loginStatus, nextProps.loginStatus)) {
      navigation.popToTop();
      navigation.replace('Main');
    }
  }

  _handleLoginPress = () => {
    this.props.navigation.push('Login');
  }

  _handleRegisterPress = () => {
    this.props.navigation.push('Register');
  }

  render() {
    const { tokenStatus } = this.props;
    if (isStatusLoading(tokenStatus)) {
      return <AppLoading />;
    }
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }} />
        <View style={styles.btnContainer}>
          <Button
            style={styles.btn}
            onPress={this._handleLoginPress}
          >
            <Text style={styles.btnText}>{LANDING_LANG.LOGIN}</Text>
          </Button>
          <Button
            style={styles.btn}
            onPress={this._handleRegisterPress}
          >
            <Text style={styles.btnText}>{LANDING_LANG.REGISTER}</Text>
          </Button>
        </View>
      </View>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
