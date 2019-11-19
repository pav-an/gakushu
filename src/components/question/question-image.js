import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput } from 'react-native';
import { Ionicons, FontAwesome, EvilIcons } from '@expo/vector-icons';

import styles from './styles';
import Difficulty from './difficulty';
import QuestionMask from './question-mask';
import { Button, Text, ImageZoom, ImageLoader } from '../common';
import { pickImage, takeImage } from '../../utils/image-picker';
import { QUESTION_LANG, COLOR } from '../../constants';

export default class QuestionText extends Component {
  static propTypes = {
    isAnswerDisplay: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
    uri: PropTypes.object.isRequired,
    difficulty: PropTypes.number.isRequired,
    onChangeText: PropTypes.func.isRequired,
    onChangeUri: PropTypes.func.isRequired,
    onChangeDifficulty: PropTypes.func.isRequired,
    onChangeImageLoading: PropTypes.func.isRequired,
    onChangeRawImageLoading: PropTypes.func.isRequired,
  };
  
  state = {
    isInputFocus: false,
    isImageLoaderLoading: false,
    isImageRawLoaderLoading: false,
    preMaskedUri: '',
  };

  imageZoom = React.createRef();
  imageLoader = React.createRef();
  imageRawLoader = React.createRef();
  questionMask = React.createRef();

  getUri = async () => {
    let uri;
    if (this.props.uri.masked) {
      uri = await this.imageLoader.current.takeScreenshot();
    } else {
      uri = await this.imageZoom.current.takeScreenshot();
    }
    const rawUri = await this.imageRawLoader.current.takeScreenshot();
    return [uri, rawUri];
  }

  _handleMaskPress = async () => {
    const { uri, onChangeUri } = this.props;
    if (!uri.masked) {
      const preMaskedUri = await this.imageZoom.current.takeScreenshot();
      this.setState({ preMaskedUri });
    } else if (!this.state.preMaskedUri) {
      const raw = await this.imageRawLoader.current.takeScreenshot();
      const preMaskedUri = await this.imageLoader.current.takeScreenshot();
      this.setState({ preMaskedUri });
      onChangeUri({ raw });
    }
    let rotate = 0;
    if (this.imageLoader.current) {
      rotate = this.imageLoader.current.fixedRotateValue;
    }
    this.questionMask.current.open(rotate);
  }

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

  _handleRemoveImagePress = () => {
    this.props.onChangeUri({
      origin: '',
      masked: '',
      raw: '',
    });
  }

  _handleRotateImagePress = () => {
    if (this.props.uri.masked) {
      if (!this.imageLoader.current) {
        return;
      }
      const isPortrait = (this.questionMask.current.getRotate() + 90) % 180 === 0;
      this.imageLoader.current.rotate(isPortrait);
      this.imageRawLoader.current.rotate(isPortrait);
    } else {
      if (!this.imageZoom.current) {
        return;
      }
      this.imageZoom.current.rotate();
    }
  }

  _renderInput() {
    const { isAnswerDisplay, text, onChangeText, difficulty, onChangeDifficulty } = this.props;
    if (isAnswerDisplay) {
      return <Difficulty
        value={difficulty}
        onChangeValue={onChangeDifficulty}
      />
    }
    return (
      <View style={styles.oneLineInputContainer}>
        <FontAwesome name='question-circle' size={30} color={COLOR.GOVERNOR_BAY} />
        <TextInput
          style={styles.oneLineTextInput}
          value={text}
          onChangeText={onChangeText}
          placeholder={QUESTION_LANG.QUESTION_TEXT_PLACEHOLDER}
        />
      </View>
    );
  }

  _renderTool () {
    const { isLoading } = this.props;

    return (
      <View style={styles.toolContainer}>
        <View style={styles.maskContainer}>
          <Button
            style={styles.btnMask}
            onPress={this._handleMaskPress}
            delayTime={0}
            disabled={isLoading}
          >
            <Ionicons name='md-color-palette' size={20} color={COLOR.WHITE} />
            <Text style={styles.textMask}>{QUESTION_LANG.MASK}</Text>
          </Button>
        </View>
        <View style={styles.btnMiniContainer}>
          <Button
            style={styles.btnMini}
            onPress={this._handlePickImage}
            delayTime={0}
            disabled={isLoading}
          >
            <Ionicons name='ios-images' size={20} color={COLOR.WHITE} />
          </Button>
          <View style={styles.separator}></View>
          <Button
            style={styles.btnMini}
            onPress={this._handleTakeImage}
            delayTime={0}
            disabled={isLoading}
          >
            <Ionicons name='ios-camera' size={20} color={COLOR.WHITE} />
          </Button>
        </View>
      </View>
    );
  }

  _renderImage () {
    const { isLoading, uri, onChangeImageLoading, onChangeRawImageLoading } = this.props;
    const underLayerStyle = { position: 'absolute', zIndex: -1, opacity: 0 };
    const isMasked = uri.masked !== '';

    return (
      <View style={styles.imageContainer}>
        {isMasked &&
          <ImageLoader
            link={uri.masked}
            containerStyle={styles.imageZoom}
            aspectRatio={1.33}
            ref={this.imageLoader}
            loading={onChangeImageLoading}
          />
        }
        <ImageLoader
          link={uri.raw}
          containerStyle={[styles.imageZoom, underLayerStyle, { zIndex: -2 }]}
          aspectRatio={1.33}
          ref={this.imageRawLoader}
          loading={onChangeRawImageLoading}
        />
        <ImageZoom
          ref={this.imageZoom}
          link={uri.origin}
          containerStyle={[styles.imageZoom, isMasked && underLayerStyle]}
          loading={onChangeImageLoading}
        />
        <Button
          style={[styles.btnOnImage, { top: 30, right: 10 }]}
          onPress={this._handleRemoveImagePress}
          disabled={isLoading}
        >
          <EvilIcons name='close' size={20} color={COLOR.WHITE} />
        </Button>
        <Button
          style={[styles.btnOnImage, { bottom: 30, right: 10 }]}
          onPress={this._handleRotateImagePress}
          disabled={isLoading}
        >
          <FontAwesome name='rotate-left' size={20} color={COLOR.WHITE} />
        </Button>
      </View>
    );
  }

  _renderMask = () => {
    const { uri, onChangeUri } = this.props;
    const { preMaskedUri } = this.state;
    return <QuestionMask
      ref={this.questionMask}
      rawUri={uri.raw}
      preMaskedUri={preMaskedUri}
      onChangeUri={maskUri => {
        onChangeUri({ masked: maskUri });
        this.imageLoader.current.resetAdjust();
      }}
    />
  }

  render() {
    return (
      <Fragment>
        {this._renderInput()}
        {this._renderImage()}
        {this._renderTool()}
        {this._renderMask()}
      </Fragment>
    );
  }
}
