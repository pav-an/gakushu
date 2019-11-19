import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';

import { isStatusLoading } from '../../utils';

export default class Button extends Component {
  static propTypes = {
    children: PropTypes.node,
    status: PropTypes.string,
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    delayTime: PropTypes.number,
    startDelayTime: PropTypes.number,
  };

  state = {
    onDelay: false,
  };

  componentDidMount() {
    const { startDelayTime } = this.props;
    if (startDelayTime) {
      this.setState({ onDelay: true });
      this.startTimeoutID = setTimeout(() => {
        this.setState({ onDelay: false });
      }, startDelayTime);
    } else {
      this.setState({ onDelay: false });
    }
  }

  componentWillUnmount() {
    if (this.pressTimeoutID) {
      clearTimeout(this.pressTimeoutID);
    }
    if (this.startTimeoutID) {
      clearTimeout(this.startTimeoutID);
    }
  }

  _handlePress = () => {
    const { onPress, delayTime } = this.props;
    if (onPress) {
      onPress();
    }
    if (delayTime === 0) {
      return;
    }
    this.setState({ onDelay: true });
    this.pressTimeoutID = setTimeout(() => {
      this.setState({ onDelay: false });
    }, delayTime || 1000);
  }

  render() {
    // eslint-disable-next-line
    const { children, status, onPress, disabled, delayTime, ...otherProps } = this.props;
    const isLoading = isStatusLoading(status) || this.state.onDelay;
    const btnDisabled = disabled || isLoading;
    return (
      <TouchableOpacity
        {...otherProps}
        onPress={this._handlePress}
        disabled={btnDisabled}
      >
        {children}
      </TouchableOpacity>
    );
  }
}
