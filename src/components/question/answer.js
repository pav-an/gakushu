import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, Animated, Keyboard, Easing } from 'react-native';
import { Ionicons, FontAwesome, EvilIcons } from '@expo/vector-icons';

import styles, { FULL_ANSWER_TOP, WINDOW_HEIGHT } from './styles';
import { Button, Text, ImageZoom } from '../common';
import { QUESTION_LANG, COLOR } from '../../constants';
import { pickImage, takeImage } from '../../utils/image-picker';

const FULL = FULL_ANSWER_TOP;
const HALF = WINDOW_HEIGHT * 0.45;
const MIN = WINDOW_HEIGHT - 40;

export default class Answer extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    uri: PropTypes.string.isRequired,
    questionUri: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isDisplay: PropTypes.bool.isRequired,
    onChangeText: PropTypes.func.isRequired,
    onChangeUri: PropTypes.func.isRequired,
    onChangeImageLoading: PropTypes.func.isRequired,
    onChangeDisplay: PropTypes.func.isRequired,
  };

  state = {
    isInputFocus: false,
  };

  imageZoom = React.createRef();
  yValue = new Animated.Value(MIN);

  getUri = async () => {
    if (this.imageZoom.current) {
      return await this.imageZoom.current.takeScreenshot();
    }
    return '';
  }

  _animate = toValue => {
    Animated.timing(this.yValue, {
      toValue,
      duration: 250,
      easing: Easing.inout,
      useNativeDriver: true,
    }).start(() => {
      this.isAnimating = false;
    })
  }

  _handleButtonPress = () => {
    if (this.isAnimating) {
      return;
    }
    this.isAnimating = true;

    const { isDisplay, onChangeDisplay } = this.props;
    if (isDisplay) {
      Keyboard.dismiss();
      this._animate(MIN);
    } else {
      this._animate(HALF);
    }
    onChangeDisplay(!isDisplay);
  }

  _handleInputFocus = () => {
    this.setState({ isInputFocus: true });
    this._animate(FULL);
  }

  _handleInputBlur = () => {
    this.setState({ isInputFocus: false });
  }

  _handleRemoveImagePress = () => {
    this.props.onChangeUri('');
  }

  _handleRotateImagePress = () => {
    this.imageZoom.current.rotate();
  }

  _handlePickImage = async () => {
    const result = await pickImage();
    if (!result.cancelled) {
      this.props.onChangeUri(result.uri);
    }
  };

  _handleTakeImage = async () => {
    const result = await takeImage();
    if (!result.cancelled) {
      this.props.onChangeUri(result.uri);
    }
  };

  _renderButton () {
    const { text, uri, questionUri, isDisplay } = this.props;
    const { ANSWER, CREATE_ANSWER, EDIT_ANSWER } = QUESTION_LANG;
    const btnText = isDisplay ? ANSWER : ((!text && !uri) ? CREATE_ANSWER : EDIT_ANSWER);

    const borderTopBtnAnswer = (!isDisplay && !questionUri) ? { borderColor: COLOR.WHITE, borderTopWidth: 3 } : null;
    return (
      <Button
        style={[styles.btnAddAnswer, borderTopBtnAnswer]}
        onPress={this._handleButtonPress}
        delayTime={0}
      >
        <Text style={styles.textBtnAddAnswer}>{btnText}</Text>
      </Button>
    );
  }

  _renderImage () {
    const { uri, onChangeImageLoading, isLoading } = this.props;
    return (
      <View style={styles.imageContainer}>
        <ImageZoom
          link={uri}
          loading={onChangeImageLoading}
          ref={this.imageZoom}
          containerStyle={styles.imageZoom}
        />
        <Button
          style={[styles.btnOnImage, { top: 30, right: 10 }]}
          onPress={this._handleRemoveImagePress}
          delayTime={0}
          disabled={isLoading}
        >
          <EvilIcons name='close' size={20} color={COLOR.WHITE} />
        </Button>
        <Button
          style={[styles.btnOnImage, { bottom: 30, right: 10 }]}
          onPress={this._handleRotateImagePress}
          delayTime={0}
        >
          <FontAwesome name='rotate-left' size={20} color={COLOR.WHITE} />
        </Button>
      </View>
    );
  }

  _renderInput() {
    const { text, onChangeText } = this.props;
    return (
      <View style={styles.topAnswerContainer}>
        <FontAwesome name='question-circle' size={30} color={COLOR.WHITE} />
        <TextInput
          style={styles.textInputAnswer}
          value={text}
          onChangeText={onChangeText}
          onFocus={this._handleInputFocus}
          onBlur={this._handleInputBlur}
          placeholder={QUESTION_LANG.ANSWER_TEXT_PLACEHOLDER}
        />
      </View>
    );
  }

  _renderImageSelect() {
    return (
      <View style={styles.bottomAnswerContainer}>
        <Button
          style={styles.btn}
          onPress={this._handlePickImage}
          delayTime={0}
        >
          <Ionicons name='ios-images' size={60} color={COLOR.WHITE} />
        </Button>
        <View style={styles.separator}></View>
        <Button
          style={styles.btn}
          onPress={this._handleTakeImage}
          delayTime={0}
        >
          <Ionicons name='ios-camera' size={70} color={COLOR.WHITE} />
        </Button>
      </View>
    )
  }

  render() {
    const { uri } = this.props;
    const { isInputFocus } = this.state;

    return (
      <Animated.View style={[
        styles.answerContainer,
        { transform: [{ translateY: this.yValue }] },
      ]}>
        {this._renderButton()}
        <View style={styles.answerWrapper}>
          {!uri ?
            this._renderInput()
            :
            this._renderImage()
          }
          {!uri && !isInputFocus && 
            this._renderImageSelect()
          }
        </View>
      </Animated.View>
    );
  }
}
