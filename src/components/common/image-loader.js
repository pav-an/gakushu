import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Image, View, StyleSheet } from 'react-native';
import { captureRef } from 'react-native-view-shot';

import { isStatusLoading, isLocalUri } from '../../utils';

export default class ImageLoader extends Component {
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

  fixedRotateValue = 0;
  rotateValue = 0;
  scaleValue = 1;

  componentWillReceiveProps(nextProps) {
    if (this.props.link !== nextProps.link) {
      this.setState({
        isImageLoading: false,
      });
    }
  }

  rotate = isPortrait => {
    this.rotateValue -= 90;
    if (this.rotateValue < 0) {
      this.rotateValue += 360;
    }
    this.fixedRotateValue -= 90;
    if (this.fixedRotateValue < 0) {
      this.fixedRotateValue += 360;
    }
    if (this.rotateValue === 90 || this.rotateValue === 270) {
      this.scaleValue = isPortrait ? 4 / 3 : 0.75;
    } else {
      this.scaleValue = 1;
    }

    this.forceUpdate();
  }

  resetAdjust = () => {
    this.rotateValue = 0;
    this.scaleValue = 1;
    this.forceUpdate();
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

  render() {
    let { status, link, containerStyle, aspectRatio } = this.props;
    aspectRatio = aspectRatio || 1.33;
    const { isImageLoading } = this.state;

    let imageDisplay;
    if (isImageLoading || isStatusLoading(status)) {
      imageDisplay = { display: 'none' };
    } else {
      imageDisplay = { display: 'flex' };
    }
    if (aspectRatio === 1) {
      imageDisplay.resizeMode = 'cover';
    } else {
      imageDisplay.resizeMode = 'contain';
    }
    imageDisplay.transform = [
      { rotate: this.rotateValue + 'deg' },
      { scale: this.scaleValue },
    ];

    return (
      <View style={[styles.container, containerStyle]}>
        <View
          style={[styles.wrapper, { aspectRatio }]}
          ref={ele => {this.imageWrapper = ele}}
        >
          { isImageLoading || isStatusLoading(status) ? <ActivityIndicator /> : null }
          { link ?
            <Image
              source={{ uri: link }}
              style={[imageDisplay, styles.image]}
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
  },
  image: {
    flex: 1,
  },
});
