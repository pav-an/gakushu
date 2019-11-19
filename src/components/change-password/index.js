import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { Input } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';

import styles from './styles';
import { NavBar, Button, Text, ConfirmModal } from '../common';
import { ErrorActions, ProfileActions } from '../../actions';
import { isStatusLoading, isStatusSuccess, isStatusError, isValidPassword } from '../../utils';
import { COMMON_LANG, CHANGE_PASSWORD_LANG } from '../../constants';

const inputFields = {
  newPassword: {
    validator: isValidPassword,
    msg: COMMON_LANG.INVALID_PASSWORD,
  },
  newPasswordConfirm: {
    validator: (p, cp) => p === cp,
    msg: COMMON_LANG.INVALID_PASSWORD_CONFIRM,
  },
};

const mapStateToProps = state => ({
  errorMsg: state.error,
  changeStatus: state.status.changePassword,
});
const mapDispatchToProps = dispatch => ({
  changePassword: input => dispatch(ProfileActions.changePassword(input)),
  resetError: () => dispatch(ErrorActions.resetError()),
});

class ChangePassword extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    errorMsg: PropTypes.string,
    changeStatus: PropTypes.string.isRequired,
    changePassword: PropTypes.func.isRequired,
    resetError: PropTypes.func.isRequired,
  };

  state = {
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
    currentPasswordErrMsg: '',
    newPasswordErrMsg: '',
    newPasswordConfirmErrMsg: '',
    isDisplayModal: false,
  }

  componentWillReceiveProps(nextProps) {
    const { changeStatus } = this.props;
    if (isStatusSuccess(changeStatus, nextProps.changeStatus)
      || isStatusError(changeStatus, nextProps.changeStatus)) {
      this.setState({ isDisplayModal: true });
    }
  }

  _handleConfirmOK = () => {
    const { errorMsg, navigation, resetError } = this.props;
    if (!errorMsg) {
      navigation.goBack(null);
    } else {
      resetError();
    }
    this.setState({ isDisplayModal: false })
  }

  _validate = key => {
    const { validator, msg } = inputFields[ key ];
    const params = [this.state[ key ]];
    if (key === 'newPasswordConfirm') {
      params.push(this.state.newPassword);
    }
    const errMsg = validator(...params) ? '' : msg; 
    this.setState({ [ `${key}ErrMsg` ]: errMsg });
    return !errMsg;
  }

  _handleChangePress = () => {
    Keyboard.dismiss();
    const { currentPassword } = this.state;
    if (currentPassword && this._validate('newPassword') && this._validate('newPasswordConfirm')) {
      this.props.changePassword(this.state);
    }
  }

  _renderInputsContainer () {
    const { changeStatus } = this.props;
    const { currentPassword, newPassword, newPasswordConfirm, currentPasswordErrMsg, newPasswordErrMsg, newPasswordConfirmErrMsg } = this.state;
    return (
      <View style={styles.inputsContainer}>
        <Input
          value={currentPassword}
          onChangeText={currentPassword => this.setState({ currentPassword })}
          placeholder={CHANGE_PASSWORD_LANG.CURRENT_PASSWORD_PLACEHOLDER}
          secureTextEntry={true}
          errorMessage={currentPasswordErrMsg}
          leftIcon={<FontAwesome name='lock' size={24} />}
          inputStyle={styles.input}
          inputContainerStyle={styles.inputWrapper}
        />
        <Input
          value={newPassword}
          onChangeText={newPassword => this.setState({ newPassword })}
          onBlur={() => this._validate('newPassword')}
          placeholder={CHANGE_PASSWORD_LANG.NEW_PASSWORD_PLACEHOLDER}
          secureTextEntry={true}
          errorMessage={newPasswordErrMsg}
          leftIcon={<FontAwesome name='lock' size={24} />}
          inputStyle={styles.input}
          inputContainerStyle={styles.inputWrapper}
        />
        <Input
          value={newPasswordConfirm}
          onChangeText={newPasswordConfirm => this.setState({ newPasswordConfirm })}
          onBlur={() => this._validate('newPasswordConfirm')}
          placeholder={CHANGE_PASSWORD_LANG.NEW_PASSWORD_CONFIRM_PLACEHOLDER}
          secureTextEntry={true}
          errorMessage={newPasswordConfirmErrMsg}
          leftIcon={<FontAwesome name='lock' size={24} />}
          inputStyle={styles.input}
          inputContainerStyle={styles.inputWrapper}
        />
        <Button
          onPress={this._handleChangePress}
          style={styles.btn}
        >
          {isStatusLoading(changeStatus) ?
            <ActivityIndicator />
            :
            <Text style={styles.textBtn}>{COMMON_LANG.SUBMIT}</Text>
          }
        </Button>
      </View>
    );
  }

  render() {
    const { navigation, errorMsg } = this.props;
    const { isDisplayModal } = this.state;
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <NavBar
            navigation={navigation}
            title={CHANGE_PASSWORD_LANG.TITLE}
          />
          {this._renderInputsContainer()}
          <ConfirmModal
            isDisplay={isDisplayModal}
            handleOK={this._handleConfirmOK}
            message={errorMsg ? errorMsg : CHANGE_PASSWORD_LANG.SUCCESS_MESSAGE}
          />
        </View>
      </TouchableWithoutFeedback>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
