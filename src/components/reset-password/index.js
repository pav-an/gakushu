import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Keyboard, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { Input } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';
import { connect } from 'react-redux';

import styles from './styles';
import { ConfirmModal, Button, Text } from '../common';
import { AuthActions, ErrorActions } from '../../actions';
import { isValidEmail, isStatusSuccess, isStatusError, isStatusLoading } from '../../utils';
import { COMMON_LANG, RESET_PASSWORD_LANG } from '../../constants';

const mapStateToProps = state => ({
  resetStatus: state.status.resetPassword,
  errorMsg: state.error,
});
const mapDispatchToProps = dispatch => ({
  resetPassword: email => dispatch(AuthActions.resetPassword(email)),
  resetError: () => dispatch(ErrorActions.resetError()),
});

class ResetPassword extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    resetStatus: PropTypes.string.isRequired,
    errorMsg: PropTypes.string.isRequired,
    resetPassword: PropTypes.func.isRequired,
    resetError: PropTypes.func.isRequired,
  };

  state = {
    email: '',
    emailErrMsg: '',
    isDisplayModal: false,
  }

  componentWillReceiveProps(nextProps) {
    const { resetStatus } = this.props;
    if (isStatusSuccess(resetStatus, nextProps.resetStatus)
      || isStatusError(resetStatus, nextProps.resetStatus)) {
      this.setState({ isDisplayModal: true });
    }
  }

  _handleRegisterPress = () => {
    this.props.navigation.replace('Register');
  }

  _handleSendPress = () => {
    Keyboard.dismiss();
    const { resetPassword, resetError } = this.props;
    const { email } = this.state;
    let emailErrMsg = '';

    if (isValidEmail(email)) {
      resetError();
      resetPassword(email);
    } else {
      emailErrMsg = RESET_PASSWORD_LANG.INVALID_EMAIL;
    }

    this.setState({ emailErrMsg });
  }

  _handleConfirmOK = () => {
    const { errorMsg, navigation } = this.props;
    if (!errorMsg) {
      navigation.replace('Login');
    }
    this.setState({ isDisplayModal: false });
  }

  _renderTopContainer() {
    const { email, emailErrMsg } = this.state;
    const { resetStatus } = this.props;
    return (
      <View style={styles.topContainer}>
        <Text style={styles.title}>{RESET_PASSWORD_LANG.TITLE}</Text>
        <Text style={styles.guild}>{RESET_PASSWORD_LANG.GUILD}</Text>
        <Input
          value={email}
          onChangeText={email => this.setState({ email })}
          keyboardType='email-address'
          placeholder={RESET_PASSWORD_LANG.EMAIL_INPUT_PLACEHOLDER}
          errorMessage={emailErrMsg}
          leftIcon={<FontAwesome name='envelope' size={18} color='black' />}
          inputStyle={styles.input}
          inputContainerStyle={styles.inputWrapper}
        />
        <Button
          onPress={this._handleSendPress}
          style={styles.btn}
        >
          {isStatusLoading(resetStatus) ?
            <ActivityIndicator />
            :
            <Text style={styles.textBtn}>{COMMON_LANG.SUBMIT}</Text>
          }
        </Button>
      </View>
    )
  }

  render() {
    const { errorMsg } = this.props;
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          {this._renderTopContainer()}
          <View style={styles.registerContainer}>
            <Text>{RESET_PASSWORD_LANG.DONT_HAVE_ACCOUNT}</Text>
            <Button onPress={this._handleRegisterPress}>
              <Text style={styles.textRegister}>{RESET_PASSWORD_LANG.REGISTER_NOW}</Text>
            </Button>
          </View>
          <ConfirmModal
            isDisplay={this.state.isDisplayModal}
            handleOK={this._handleConfirmOK}
            message={errorMsg ? errorMsg : RESET_PASSWORD_LANG.SUCCESS_MESSAGE}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
