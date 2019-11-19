import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

import { APP_CONST } from '../../constants';

export default class CommonText extends Component {
  static propTypes = {
    style: Text.propTypes.style,
    children: PropTypes.node,
  };

  render () {
    const { children, style, ...otherProps } = this.props;
    return (
      <Text
        {...otherProps}
        style={[{ fontFamily: APP_CONST.DEFAULT_FONT }, style]}
      >
        {children}
      </Text>
    );
  }
}
