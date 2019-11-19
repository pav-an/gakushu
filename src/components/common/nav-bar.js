import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';

import Text from './text';
import Button from './button';
import { UI_CONST, COLOR, COMMON_LANG } from '../../constants';

export default class NavBar extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    title: PropTypes.string.isRequired,
    onBack: PropTypes.func,
    isTextBtn: PropTypes.bool,
    children: PropTypes.node,
  };

  _defaultOnBack = () => {
    this.props.navigation.goBack(null);
  }

  render() {
    const { title, onBack, isTextBtn, children } = this.props;
    return (
      <View style={styles.container}>
        <Button
          style={styles.btn}
          onPress={onBack || this._defaultOnBack}
        >
          {isTextBtn ?
            <Text style={styles.btnText}>{COMMON_LANG.CANCEL}</Text>
            :
            <Ionicons name="ios-arrow-back" size={50} color={COLOR.BLACK}/>
          }
        </Button>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.childrenWrapper}>{children}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: UI_CONST.NAV_BAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLOR.GOVERNOR_BAY,
    backgroundColor: COLOR.WILD_SAND,
  },
  btn: {
    height: UI_CONST.NAV_BAR_HEIGHT,
    width: UI_CONST.NAV_BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 18,
    color: COLOR.CINNABAR,
  },
  titleWrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    color: COLOR.BLACK,
  },
  childrenWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
