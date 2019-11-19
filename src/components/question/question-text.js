import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { TextInput, View, Keyboard } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

import styles from './styles';
import Difficulty from './difficulty';
import { Button, Text } from '../common';
import { pickImage, takeImage } from '../../utils/image-picker';
import { QUESTION_LANG, COMMON_LANG, COLOR } from '../../constants';

export default class QuestionText extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    difficulty: PropTypes.number.isRequired,
    keyboardHeight: PropTypes.number.isRequired,
    isAnswerDisplay: PropTypes.bool.isRequired,
    onChangeText: PropTypes.func.isRequired,
    onChangeUri: PropTypes.func.isRequired,
    onChangeDifficulty: PropTypes.func.isRequired,
  };
  
  state = {
    isInputFocus: false,
  };

  _handleDonePress = () => {
    Keyboard.dismiss();
  };

  _handlePickImage = async () => {
    const result = await pickImage();
    if (!result.cancelled) {
      this.props.onChangeUri({ origin: result.uri });
    }
  };

  _handleTakeImage = async () => {
    const result = await takeImage();
    if (!result.cancelled) {
      this.props.onChangeUri({ origin: result.uri });
    }
  };

  _renderDifficulty = () => {
    const { difficulty, onChangeDifficulty } = this.props;
    return <Difficulty
      value={difficulty}
      onChangeValue={onChangeDifficulty}
    />
  }

  _renderTop = () => {
    const { text, onChangeText, keyboardHeight, isAnswerDisplay } = this.props;
    const { isInputFocus } = this.state;
    return (
      <View style={styles.topContainer}>
        {isAnswerDisplay && this._renderDifficulty()}
        <View style={styles.inputContainer}>
          <FontAwesome name='question-circle' size={30} color={COLOR.GOVERNOR_BAY} />
          <TextInput
            value={text}
            onChangeText={onChangeText}
            placeholder={QUESTION_LANG.QUESTION_TEXT_PLACEHOLDER}
            onFocus={() => this.setState({ isInputFocus: true })}
            onBlur={() => this.setState({ isInputFocus: false })}
            style={styles.textInput}
            multiline={true}
          />
        </View>
        {isInputFocus &&
          <Button
            onPress={this._handleDonePress}
            style={[styles.btnDone, { bottom: keyboardHeight }]}
            delayTime={0}
          >
            <Text style={styles.textBtnDone}>{COMMON_LANG.DONE}</Text>
          </Button>
        }
      </View>
    );
  }

  _renderBottom = () => (
    <View style={styles.bottomContainer}>
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
  );

  render() {
    const { isInputFocus } = this.state;
    return (
      <Fragment>
        {this._renderTop()}
        {!isInputFocus && this._renderBottom()}
      </Fragment>
    );
  }
}
