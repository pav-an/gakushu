import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Keyboard, ActivityIndicator, ScrollView } from 'react-native';
import { FontAwesome, Zocial } from '@expo/vector-icons';
import { Input } from 'react-native-elements';
import moment from 'moment';

import styles from './styles';
import { SocialModal, ConfirmModal, DatePicker, Button, Text } from '../common';
import { AuthActions, ErrorActions } from '../../actions';
import { isValidEmail, isValidName, isValidPassword, isStatusSuccess, isStatusError, isStatusLoading } from '../../utils';
import { SOCIAL_COLOR, DATE_FORMAT, DEFAULT_BIRTHDAY, MIN_BIRTHDAY, MAX_BIRTHDAY, COMMON_LANG, REGISTER_LANG } from '../../constants';

const inputFields = {
  email: {
    validator: isValidEmail,
    msg: COMMON_LANG.INVALID_EMAIL,
  },
  name: {
    validator: isValidName,
    msg: COMMON_LANG.INVALID_NAME,
  },
  password: {
    validator: isValidPassword,
    msg: COMMON_LANG.INVALID_PASSWORD,
  },
  passwordConfirm: {
    validator: (p, cp) => p === cp,
    msg: COMMON_LANG.INVALID_PASSWORD_CONFIRM,
  },
};

const mapStateToProps = state => ({
  errorMsg: state.error,
  registerStatus: state.status.register,
});
const mapDispatchToProps = dispatch => ({
  register: input => dispatch(AuthActions.register(input)),
  loginSocial: token => dispatch(AuthActions.loginSocial(token)),
  resetError: () => dispatch(ErrorActions.resetError()),
});

class Register extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    registerStatus: PropTypes.string.isRequired,
    errorMsg: PropTypes.string,
    loginSocial: PropTypes.func.isRequired,
    resetError: PropTypes.func.isRequired,
  };

  state = {
    email: '',
    name: '',
    birthday: DEFAULT_BIRTHDAY,
    password: '',
    passwordConfirm: '',

    nameErrMsg: '',
    emailErrMsg: '',
    passwordErrMsg: '',
    passwordConfirmErrMsg: '',
    isDisplayModal: false,
  }

  socialModal = React.createRef();
  datePicker = React.createRef();

  componentWillReceiveProps(nextProps) {
    const { registerStatus } = this.props;
    if (isStatusSuccess(registerStatus, nextProps.registerStatus)
      || isStatusError(registerStatus, nextProps.registerStatus)) {
      this.setState({ isDisplayModal: true });
    }
  }

  _validate = key => {
    const { validator, msg } = inputFields[ key ];
    const params = [this.state[ key ]];
    if (key === 'passwordConfirm') {
      params.push(this.state.password);
    }
    const errMsg = validator(...params) ? '' : msg; 
    this.setState({ [ `${key}ErrMsg` ]: errMsg });
    return !errMsg;
  }

  _handleRegisterPress = () => {
    Keyboard.dismiss();
    if (this._validate('email') && this._validate('name') && this._validate('password') && this._validate('passwordConfirm')) {
      const { resetError, register } = this.props;
      resetError();
      register(this.state);
    }
  }

  _handleLoginPress = () => {
    this.props.navigation.replace('Login');
  }

  _handleConfirmOK = () => {
    const { errorMsg, navigation } = this.props;
    if (!errorMsg) {
      navigation.replace('Login');
    }
    this.setState({ isDisplayModal: false })
  }

  _handleSocialPress = provider => {
    this.socialModal.current.open(provider);
  }

  _handleLoginSocialSuccess = token => {
    this.props.loginSocial(token);
  }

  _handleDatePickerPress = () => {
    this.datePicker.current.open();
  }

  _renderTopContainer() {
    const { registerStatus } = this.props;
    const { email, name, birthday, password, passwordConfirm, emailErrMsg, nameErrMsg, passwordErrMsg, passwordConfirmErrMsg } = this.state;

    const btnDate = (
      <Button onPress={this._handleDatePickerPress}>
        <FontAwesome name='calendar' size={24} />
      </Button>
    );
    return (
      <View style={styles.topContainer}>
        <Text style={styles.title}>REGISTER</Text>
        <Input
          value={email}
          onChangeText={email => this.setState({ email })}
          onBlur={() => this._validate('email')}
          keyboardType='email-address'
          placeholder={REGISTER_LANG.EMAIL_INPUT_PLACEHOLDER}
          errorMessage={emailErrMsg}
          leftIcon={<FontAwesome name='envelope' size={18} />}
          inputStyle={styles.input}
          inputContainerStyle={styles.inputWrapper}
        />
        <Input
          value={name}
          onChangeText={name => this.setState({ name })}
          onBlur={() => this._validate('name')}
          placeholder={REGISTER_LANG.NAME_INPUT_PLACEHOLDER}
          errorMessage={nameErrMsg}
          leftIcon={<FontAwesome name='user' size={24} />}
          inputStyle={styles.input}
          inputContainerStyle={styles.inputWrapper}
        />
        <Input
          value={password}
          onChangeText={password => this.setState({ password })}
          onBlur={() => this._validate('password')}
          placeholder={REGISTER_LANG.PASSWORD_INPUT_PLACEHOLDER}
          secureTextEntry={true}
          errorMessage={passwordErrMsg}
          leftIcon={<FontAwesome name='lock' size={24} />}
          inputStyle={styles.input}
          inputContainerStyle={styles.inputWrapper}
        />
        <Input
          value={passwordConfirm}
          onChangeText={passwordConfirm => this.setState({ passwordConfirm })}
          onBlur={() => this._validate('passwordConfirm')}
          placeholder={REGISTER_LANG.PASSWORD_CONFIRM_INPUT_PLACEHOLDER}
          secureTextEntry={true}
          errorMessage={passwordConfirmErrMsg}
          leftIcon={<FontAwesome name='lock' size={24} />}
          inputStyle={styles.input}
          inputContainerStyle={styles.inputWrapper}
        />
        <Input
          value={moment(birthday).format(DATE_FORMAT)}
          leftIcon={<FontAwesome name='birthday-cake' size={24} />}
          rightIcon={btnDate}
          disabled={true}
          inputStyle={styles.input}
          inputContainerStyle={styles.inputWrapper}
        />
        <Button
          onPress={this._handleRegisterPress}
          style={styles.btnRegister}
        >
          {isStatusLoading(registerStatus) ?
            <ActivityIndicator />
            :
            <Text style={styles.textBtnRegister}>{COMMON_LANG.SUBMIT}</Text>
          }
        </Button>
      </View>
    )
  }

  _renderSocials() {
    return (
      <View style={styles.socialContainer}>
        <Text style={styles.titleSocial}>{REGISTER_LANG.REGISTER_WITH}</Text>
        <View style={styles.btnSocialWrapper}>
          <Button
            onPress={this._handleSocialPress.bind(this, 'facebook')}
            style={[styles.btnSocial, { backgroundColor: SOCIAL_COLOR.FACEBOOK }]}
          >
            <Zocial name='facebook' size={25} color='white' />
          </Button>
          <Button
            onPress={this._handleSocialPress.bind(this, 'instagram')}
            style={[styles.btnSocial, { backgroundColor: SOCIAL_COLOR.INSTAGRAM }]}
          >
            <Zocial name='instagram' size={25} color='white' />
          </Button>
          <Button
            onPress={this._handleSocialPress.bind(this, 'twitter')}
            style={[styles.btnSocial, { backgroundColor: SOCIAL_COLOR.TWITTER }]}
          >
            <Zocial name='twitter' size={25} color='white' />
          </Button>
          <Button
            onPress={this._handleSocialPress.bind(this, 'yahoo-jp')}
            style={[styles.btnSocial, { backgroundColor: SOCIAL_COLOR.YAHOO }]}
          >
            <Zocial name='yahoo' size={25} color='white' />
          </Button>
        </View>
      </View>
    );
  }

  render() {
    const { errorMsg } = this.props;
    const { isDisplayModal, birthday } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView>
          {this._renderTopContainer()}
          <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>{REGISTER_LANG.OR}</Text>
            <View style={styles.separatorLine} />
          </View>
          {this._renderSocials()}
          <View style={styles.bottomContainer}>
            <Text>{REGISTER_LANG.HAVE_AN_ACCOUNT}</Text>
            <Button onPress={this._handleLoginPress}>
              <Text style={styles.textLogin}>{REGISTER_LANG.LOGIN}</Text>
            </Button>
          </View>
        </ScrollView>
        <ConfirmModal
          isDisplay={isDisplayModal}
          handleOK={this._handleConfirmOK}
          message={errorMsg ? errorMsg : REGISTER_LANG.SUCCESS_MESSAGE}
        />
        <SocialModal
          ref={this.socialModal}
          onSuccess={this._handleLoginSocialSuccess}
        />
        <DatePicker
          ref={this.datePicker}
          date={birthday}
          onChangeDate={birthday => this.setState({ birthday })}
          minDate={MIN_BIRTHDAY}
          maxDate={MAX_BIRTHDAY}
        />
      </View>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Register);
