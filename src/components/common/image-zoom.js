import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image, Animated, StyleSheet, PanResponder, ActivityIndicator } from 'react-native';
import { captureRef } from 'react-native-view-shot';

import { isStatusLoading, isLocalUri } from '../../utils';
import { COLOR } from '../../constants';

const SCALE_MAXIMUM = 5;
const SCALE_MINIMUM = 1;
const SCALE_MULTIPLIER = 1.2;

const pow2abs = (a, b) => Math.pow(Math.abs(a - b), 2);

function getDistance(touches) {
  const [a, b] = touches;
  if (a == null || b == null) {
    return 0;
  }
  return Math.sqrt(pow2abs(a.pageX, b.pageX) + pow2abs(a.pageY, b.pageY));
}

export default class ImageZoom extends Component {
  static propTypes = {
    link: PropTypes.string,
    status: PropTypes.string,
    containerStyle: PropTypes.any,
    aspectRatio: PropTypes.number,
    loading: PropTypes.func,
  };

  state = {
    isImageLoading: false,
  };

  constructor(props) {
    super(props);

    this._generatePanHandlers();
    this._resetAdjust();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.link !== nextProps.link) {
      this._resetAdjust();
      this._getImageSize(nextProps.link);
    }
  }

  rotate = () => {
    const rotate = this.rotateValue
    this._resetAdjust();
    this.rotateValue = rotate - 90;
    if (this.rotateValue < 0) {
      this.rotateValue += 360;
    }

    const width = this.imageWidth;
    this.imageWidth = this.imageHeight;
    this.imageHeight = width;

    this.scaleValue.setValue(this._getRotateScaleValue());

    this.forceUpdate();
  }

  _getRotateScaleValue = () => {
    if (this.rotateValue === 90 || this.rotateValue === 270) {
      return this.wrapperWidth === this.imageHeight ? this.wrapperHeight / this.imageHeight : this.wrapperWidth / this.imageWidth;
    }
    return SCALE_MINIMUM;
  }

  _resetAdjust = () => {
    this.lastScale = 1;
    this.scaleValue = new Animated.Value(1);
    this.rotateValue = 0;
    this.lastTranslate = [0, 0];
    this.translateValue = new Animated.ValueXY();
    this.initialTouches = [];
    this.numberOfTouches = 0;
  }

  _calNextScale = touches => {
    const currentDistance = getDistance(touches);
    const initialDistance = getDistance(this.initialTouches);

    if (!initialDistance) {
      return;
    }

    let nextScale = (currentDistance / initialDistance) * SCALE_MULTIPLIER * this.lastScale;

    let minScale = this._getRotateScaleValue()

    if (nextScale < minScale) {
      nextScale = minScale;
    } else if (nextScale > SCALE_MAXIMUM) {
      nextScale = SCALE_MAXIMUM;
    }
    this.scaleValue.setValue(nextScale);
  }

  _calNextTranslate = (posX, posY) => {
    let x = posX;
    let y = posY;
    const boundX = this.imageWidth * this.scaleValue._value / 2 - this.wrapperWidth / 2;
    const boundY = this.imageHeight * this.scaleValue._value / 2 - this.wrapperHeight / 2;
    const minBoundX = Math.min(-boundX, boundX);
    const minBoundY = Math.min(-boundY, boundY);
    const maxBoundX = Math.max(-boundX, boundX);
    const maxBoundY = Math.max(-boundY, boundY);
    if (x < minBoundX) {
      x = minBoundX
    } else if (x > maxBoundX) {
      x = maxBoundX
    }
    if (y < minBoundY) {
      y = minBoundY
    } else if (y > maxBoundY) {
      y = maxBoundY
    }
    this.translateValue.x.setValue(x);
    this.translateValue.y.setValue(y);
  }

  _onGestureStart(event) {
    this.initialTouches = event.touches;
    this.numberOfTouches = event.touches.length;
  }

  _onGestureMove(event, gestureState) {
    if (this.numberOfTouches === 1 && event.touches.length === 2) {
        this.initialTouches = event.touches;
    }

    const { touches } = event;

    if (touches.length > 1) {
      this._calNextScale(touches);
      this.numberOfTouches = event.touches.length;
    }

    this._calNextTranslate(
      this.lastTranslate[ 0 ] + gestureState.dx,
      this.lastTranslate[ 1 ] + gestureState.dy,
    );
  }

  _onGestureRelease(event, gestureState) {
    this._calNextTranslate(
      this.lastTranslate[ 0 ] + gestureState.dx,
      this.lastTranslate[ 1 ] + gestureState.dy,
    );
    this.lastTranslate = [this.translateValue.x._value, this.translateValue.y._value];
    this.numberOfTouches = 0;
    this.lastScale = this.scaleValue._value;
  }

  _generatePanHandlers() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (event, gestureState) => {
        this._onGestureStart(event.nativeEvent, gestureState);
      },
      onPanResponderMove: (event, gestureState) => {
        this._onGestureMove(event.nativeEvent, gestureState);
      },
      onPanResponderRelease: (event, gestureState) => {
        this._onGestureRelease(event.nativeEvent, gestureState);
      },
      onPanResponderTerminationRequest: () => {},
      onPanResponderTerminate: (event, gestureState) => {
        this._onGestureRelease(event.nativeEvent, gestureState);
      },
    });
  }

  _handleWrapperOnLayout = event => {
    const { width, height } = event.nativeEvent.layout;
    this.wrapperWidth = width;
    this.wrapperHeight = height;
    this._getImageSize(this.props.link);
  }

  _getImageSize = link => {
    Image.getSize(link, (width, height) => {
      if (this.wrapperHeight / this.wrapperWidth > height / width) {
        this.imageWidth = this.wrapperWidth;
        this.imageHeight = this.wrapperWidth * height / width;
      } else {
        this.imageWidth = this.wrapperHeight * width / height;
        this.imageHeight = this.wrapperHeight;
      }
    });
  }

  _handleOnLoadStart = () => {
    if (isLocalUri(this.props.link)) {
      return;
    }
    if (this.props.loading) {
      this.props.loading(true);
    }
    this.setState({ isImageLoading: true })
  }

  _handleOnLoadEnd = () => {
    if (isLocalUri(this.props.link)) {
      return;
    }
    if (this.props.loading) {
      this.props.loading(false);
    }
    this.setState({ isImageLoading: false })
  }

  takeScreenshot = async () => {
    let uri = await captureRef(this.imageWrapper, {
      format: 'png',
      quality: 1,
    });
    if (!isLocalUri(uri)) {
      uri = 'file://' + uri;
    }
    return uri;
  }

  render() {
    let { status, link, containerStyle, aspectRatio } = this.props;
    aspectRatio = aspectRatio || 1.33;
    const { isImageLoading } = this.state;

    let imageStyle;
    if (isImageLoading || isStatusLoading(status)) {
      imageStyle = [styles.image, { display: 'none' }];
    } else {
      const animatedStyle = { transform: this.translateValue.getTranslateTransform() };
      animatedStyle.transform.push({ scale: this.scaleValue });
      animatedStyle.transform.push({ rotate: this.rotateValue + 'deg' });
      imageStyle = [
        styles.image,
        animatedStyle,
      ];
    }

    return (
      <View style={[styles.container, containerStyle]}>
        <View
          style={[styles.wrapper, { aspectRatio }]}
          {...this.panResponder.panHandlers}
          onLayout={this._handleWrapperOnLayout}
          ref={ele => {this.imageWrapper = ele}}
        >
          { isImageLoading || isStatusLoading(status) ? <ActivityIndicator /> : null }
          { link ?
            <Animated.Image
              source={{ uri: link }}
              style={imageStyle}
              onLoadStart={this._handleOnLoadStart}
              onLoadEnd={this._handleOnLoadEnd}
              fadeDuration={0}
            />
            :
            null
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: COLOR.WHITE,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
});
