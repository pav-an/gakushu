import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Keyboard, ActivityIndicator, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Input } from 'react-native-elements';
import { Feather, Zocial } from '@expo/vector-icons';

import styles from './styles';
import { SocialModal, ConfirmModal, Button, Text } from '../common';
import { AuthActions, ErrorActions } from '../../actions';
import { isStatusLoading, isStatusError } from '../../utils';
import { SOCIAL_COLOR, LOGIN_LANG } from '../../constants';

const mapStateToProps = state => ({
  errorMsg: state.error,
  loginStatus: state.status.login,
});
const mapDispatchToProps = dispatch => ({
  login: (email, password) => dispatch(AuthActions.login(email, password)),
  loginSocial: token => dispatch(AuthActions.loginSocial(token)),
  resetError: () => dispatch(ErrorActions.resetError()),
});

class Login extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    loginStatus: PropTypes.string.isRequired,
    errorMsg: PropTypes.string,
    login: PropTypes.func.isRequired,
    loginSocial: PropTypes.func.isRequired,
    resetError: PropTypes.func.isRequired,
  };

  state = {
    email: '',
    password: '',
    securePassword: true,
    isDisplayModal: false,
    inputErrorMsg: '',
  }

  socialModal = React.createRef();

  componentWillReceiveProps(nextProps) {
    const { loginStatus } = this.props;
    if (isStatusError(loginStatus, nextProps.loginStatus)) {
      this.setState({ isDisplayModal: true });
    }
  }

  _handleRegisterPress = () => {
    this.props.navigation.replace('Register');
  }

  _handleResetPasswordPress = () => {
    this.props.navigation.replace('ResetPassword');
  }

  _handleToggleHidePassword = () => {
    this.setState(state => ({
      securePassword: !state.securePassword,
    }));
  }

  _handleConfirmOK = () => {
    this.setState({ isDisplayModal: false, inputErrorMsg: '' })
  }

  _handleSocialPress = provider => {
    this.socialModal.current.open(provider);
  }

  _handleLoginPress = () => {
    Keyboard.dismiss();
    const { login, resetError } = this.props;
    const { email, password } = this.state;
    if (!email) {
      this.setState({
        isDisplayModal: true,
        inputErrorMsg: LOGIN_LANG.INVALID_EMAIL,
      });
      return;
    }
    if (!password) {
      this.setState({
        isDisplayModal: true,
        inputErrorMsg: LOGIN_LANG.INVALID_PASSWORD,
      });
      return;
    }
    resetError();
    login(email, password);
  }

  _handleLoginSocialSuccess = token => {
    this.props.loginSocial(token);
  }

  _renderTopContainer() {
    const { email, password, securePassword } = this.state;
    const { loginStatus } = this.props;

    const btnHidePassword = (
      <Button onPress={this._handleToggleHidePassword}>
        <Feather
          name={securePassword ? 'eye' : 'eye-off'}
          size={24}
        />
      </Button>
    );
    return (
      <View style={styles.topContainer}>
        <Text style={styles.title}>SIGN IN</Text>
        <Input
          value={email}
          onChangeText={email => this.setState({ email })}
          keyboardType='email-address'
          placeholder='Email'
          inputStyle={{ marginLeft: 10 }}
          inputContainerStyle={styles.inputEmail}
        />
        <Input
          value={password}
          onChangeText={password => this.setState({ password })}
          secureTextEntry={securePassword}
          placeholder='Password'
          rightIcon={btnHidePassword}
          inputStyle={{ marginLeft: 10 }}
          inputContainerStyle={styles.inputPassword}
        />
        <Button
          onPress={this._handleResetPasswordPress}
          style={styles.forgotPassword}
        >
          <Text style={styles.whiteColor}>Forgot your password?</Text>
        </Button>
        <Button
          onPress={this._handleLoginPress}
          style={styles.btnLogin}
        >
          {isStatusLoading(loginStatus) ?
            <ActivityIndicator />
            :
            <Text style={styles.textBtnLogin}>LOGIN</Text>
          }
        </Button>
      </View>
    )
  }

  _renderSocials() {
    return (
      <View style={styles.socialContainer}>
        <Button
          onPress={this._handleSocialPress.bind(this, 'facebook')}
          style={[styles.btnSocial, { backgroundColor: SOCIAL_COLOR.FACEBOOK }]}
        >
          <Zocial name='facebook' size={20} color='white' />
          <Text style={styles.whiteColor}>{LOGIN_LANG.LOGIN_WITH_FACEBOOK}</Text>
        </Button>
        <Button 
          onPress={this._handleSocialPress.bind(this, 'instagram')}
          style={[styles.btnSocial, { backgroundColor: SOCIAL_COLOR.INSTAGRAM }]}
        >
          <Zocial name='instagram' size={20} color='white' />
          <Text style={styles.whiteColor}>{LOGIN_LANG.LOGIN_WITH_INSTAGRAM}</Text>
        </Button>
        <Button
          onPress={this._handleSocialPress.bind(this, 'twitter')}
          style={[styles.btnSocial, { backgroundColor: SOCIAL_COLOR.TWITTER }]}
        >
          <Zocial name='twitter' size={20} color='white' />
          <Text style={styles.whiteColor}>{LOGIN_LANG.LOGIN_WITH_TWITTER}</Text>
        </Button>
        <Button
          onPress={this._handleSocialPress.bind(this, 'yahoo-jp')}
          style={[styles.btnSocial, { backgroundColor: SOCIAL_COLOR.YAHOO }]}
        >
          <Zocial name='yahoo' size={20} color='white' />
          <Text style={styles.whiteColor}>{LOGIN_LANG.LOGIN_WITH_YAHOO}</Text>
        </Button>
      </View>
    );
  }

  render() {
    const { errorMsg } = this.props;
    const { isDisplayModal, inputErrorMsg } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView>
          {this._renderTopContainer()}
          <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>{LOGIN_LANG.OR}</Text>
            <View style={styles.separatorLine} />
          </View>
          {this._renderSocials()}
          <View style={styles.bottomContainer}>
            <Text>{LOGIN_LANG.DONT_HAVE_ACCOUNT}</Text>
            <Button onPress={this._handleRegisterPress}>
              <Text style={styles.textRegister}>{LOGIN_LANG.REGISTER_NOW}</Text>
            </Button>
          </View>
        </ScrollView>
        <ConfirmModal
          isDisplay={isDisplayModal}
          handleOK={this._handleConfirmOK}
          message={errorMsg || inputErrorMsg}
        />
        <SocialModal
          ref={this.socialModal}
          onSuccess={this._handleLoginSocialSuccess}
        />
      </View>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);
