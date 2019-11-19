import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableWithoutFeedback, ActivityIndicator, Keyboard, Image } from 'react-native';
import { connect } from 'react-redux';
import { Input } from 'react-native-elements';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import moment from 'moment';

import styles from './styles';
import { NavBar, ConfirmModal, DatePicker, Button, Text } from '../common';
import { ProfileActions, AuthActions } from '../../actions';
import { isValidName, isStatusSuccess, isStatusLoading } from '../../utils';
import { pickImage, takeImage } from '../../utils/image-picker';
import { COLOR, DATE_FORMAT, DEFAULT_BIRTHDAY, MIN_BIRTHDAY, MAX_BIRTHDAY, COMMON_LANG, PROFILE_LANG } from '../../constants';

const mapStateToProps = state => ({
  profile: state.profile,
  getStatus: state.status.getProfile,
  uploadStatus: state.status.uploadProfile,
  resendStatus: state.status.resendVerifyEmail,
  logoutStatus: state.status.logout,
});
const mapDispatchToProps = dispatch => ({
  getProfile: () => dispatch(ProfileActions.getProfile()),
  uploadProfile: profile => dispatch(ProfileActions.uploadProfile(profile)),
  resendVerifyEmail: () => dispatch(ProfileActions.resendVerifyEmail()),
  logout: () => dispatch(AuthActions.logout()),
});

class Profile extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    profile: PropTypes.object,
    getStatus: PropTypes.string.isRequired,
    uploadStatus: PropTypes.string.isRequired,
    resendStatus: PropTypes.string.isRequired,
    logoutStatus: PropTypes.string.isRequired,
    getProfile: PropTypes.func.isRequired,
    uploadProfile: PropTypes.func.isRequired,
    resendVerifyEmail: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
  };
  static navigationOptions = {
    title: PROFILE_LANG.TITLE,
  };

  state = {
    email: '',
    name: '',
    nameErrMsg: '',
    birthday: DEFAULT_BIRTHDAY,
    avatarUri: '',
    isDisplayModal: false,
  }

  datePicker = React.createRef();

  componentDidMount() {
    this.props.getProfile();
  }

  componentWillReceiveProps(nextProps) {
    const { getStatus, uploadStatus, logoutStatus, navigation } = this.props;
    if (isStatusSuccess(getStatus, nextProps.getStatus)) {
      const { email, name, birthday, avatar_url } = nextProps.profile;
      this.setState({
        email,
        name,
        birthday: birthday ? new Date(birthday) : DEFAULT_BIRTHDAY,
        avatarUri: avatar_url,
      });
    }
    if (isStatusSuccess(logoutStatus, nextProps.logoutStatus)) {
      navigation.replace('Landing');
    }
    if (isStatusSuccess(uploadStatus, nextProps.uploadStatus)) {
      this.setState({ isDisplayModal: true });
    }
  }

  _validateName = () => {
    const { name } = this.state;
    let nameErrMsg = '';
    if (!isValidName(name)) {
      nameErrMsg = COMMON_LANG.INVALID_NAME;
    }
    this.setState({ nameErrMsg });
    return !nameErrMsg;
  }

  _handleUpdatePress = () => {
    if (this._validateName()) {
      this.props.uploadProfile(this.state);
    }
  }

  _handleResendPress = () => {
    this.props.resendVerifyEmail();
  }

  _handleLogoutPress = () => {
    this.props.logout();
  }

  _handleChangePasswordPress = () => {
    this.props.navigation.navigate('ChangePassword');
  }

  _handleDatePickerPress = () => {
    this.datePicker.current.open();
  }

  _handlePickImage = async () => {
    const result = await pickImage();
    if (!result.cancelled) {
      this.setState({ avatarUri: result.uri });
    }
  }

  _handleTakeImage = async () => {
    const result = await takeImage();
    if (!result.cancelled) {
      this.setState({ avatarUri: result.uri });
    }
  }

  _handleConfirmOK = () => {
    this.setState({ isDisplayModal: false })
  }

  _renderProfile() {
    const { profile } = this.props;
    const { email, name, birthday, avatarUri, nameErrMsg } = this.state;
    const isVerifiedEmail = profile.is_verified_email;
    const btnDate = (
      <Button onPress={this._handleDatePickerPress}>
        <FontAwesome name='calendar' size={24} />
      </Button>
    );

    const icon = isVerifiedEmail ? 'check' : 'exclamation-triangle';
    const iconColor = isVerifiedEmail ? COLOR.LIGHT_GREEN : COLOR.LIGHT_RED;
    const emailErrMsg = isVerifiedEmail ? '' : PROFILE_LANG.VERIFY_EMAIL_MESSAGE;
    const iconEmail = (
      <View style={styles.iconEmail}>
        <FontAwesome name={icon} size={20} color={iconColor} />
      </View>
    );

    return (
      <View style={styles.profileContainer}>
        <View style={styles.profileTop}>
          {avatarUri ?
            <Image
              style={styles.avatar}
              source={{ uri: avatarUri }}
            />
            :
            <View style={styles.avatar} />
          }
          <View style={styles.btnAvatarWrapper}>
            <Button
              style={[styles.btnAvatar, styles.btnAvatarLeft]}
              onPress={this._handlePickImage}
            >
              <Ionicons name='ios-images' size={20} color={COLOR.WHITE} />
            </Button>
            <Button
              style={styles.btnAvatar}
              onPress={this._handleTakeImage}
            >
              <Ionicons name='ios-camera' size={20} color={COLOR.WHITE} />
            </Button>
          </View>
          <View style={{ flex: 1 }}>
            <Input
              value={name}
              onChangeText={name => this.setState({ name })}
              onBlur={() => this._validateName()}
              leftIcon={<FontAwesome name='user' size={24} />}
              rightIcon={<FontAwesome name='pencil' size={24} />}
              errorMessage={nameErrMsg}
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
          </View>
        </View>
        {email !== '' && 
          <Input
            value={email}
            disabled={true}
            leftIcon={<FontAwesome name='envelope' size={18} />}
            rightIcon={iconEmail}
            errorMessage={emailErrMsg}
            inputStyle={styles.input}
            inputContainerStyle={styles.inputWrapper}
          />
        }
      </View>
    );
  }

  _renderButtons() {
    const { profile, getStatus, uploadStatus, resendStatus } = this.props;
    const isVerifiedEmail = profile && profile.is_verified_email;
    return (
      <View style={styles.buttonsContainer}>
        {isStatusSuccess(getStatus) && !isVerifiedEmail ?
          <Button
            onPress={this._handleResendPress}
            style={[styles.btn, styles.btnWhite]}
          >
            {isStatusLoading(resendStatus) ?
              <ActivityIndicator />
              :
              <Text style={[styles.textBtn, styles.textBtnBlue]}>{PROFILE_LANG.SEND_VERIFY_EMAIL}</Text>
            }
          </Button>
          :
          <View style={[styles.btn, { backgroundColor: COLOR.WHITE }]} />
        }
        <Button
          onPress={this._handleUpdatePress}
          style={styles.btn}
        >
          {isStatusLoading(uploadStatus) ?
            <ActivityIndicator />
            :
            <Text style={styles.textBtn}>{PROFILE_LANG.UPDATE}</Text>
          }
        </Button>
        <Button
          onPress={this._handleChangePasswordPress}
          style={styles.btn}
        >
          <Text style={styles.textBtn}>{PROFILE_LANG.CHANGE_PASSWORD}</Text>
        </Button>
        <Button
          onPress={this._handleLogoutPress}
          style={[styles.btn, { backgroundColor: COLOR.LIGHT_RED }]}
        >
          <Text style={styles.textBtn}>{PROFILE_LANG.LOGOUT}</Text>
        </Button>
      </View>
    );
  }

  render() {
    const { navigation, getStatus } = this.props;
    const { birthday, isDisplayModal } = this.state;
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <NavBar
            navigation={navigation}
            title={PROFILE_LANG.TITLE}
          />
          {isStatusSuccess(getStatus) ?
            this._renderProfile()
            :
            <View style={styles.profileContainer}>
              <ActivityIndicator />
            </View>
          }
          {this._renderButtons()}
          <ConfirmModal
            isDisplay={isDisplayModal}
            handleOK={this._handleConfirmOK}
            message={PROFILE_LANG.SUCCESS_MESSAGE}
          />
          <DatePicker
            ref={this.datePicker}
            date={birthday}
            onChangeDate={birthday => this.setState({ birthday })}
            minDate={MIN_BIRTHDAY}
            maxDate={MAX_BIRTHDAY}
          />
        </View>
      </TouchableWithoutFeedback>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
