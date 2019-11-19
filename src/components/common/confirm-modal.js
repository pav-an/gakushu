import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

import Text from './text';
import Button from './button';
import { COMMON_LANG, COLOR } from '../../constants';

export default class ConfirmModal extends Component {
  static propTypes = {
    handleOK: PropTypes.func.isRequired,
    handleCancel: PropTypes.func,
    isDisplay: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
  };

  render() {
    const { handleOK, handleCancel, isDisplay, message } = this.props;
    if (!isDisplay) {
      return null;
    }
    return (
      <View style={styles.container}>
        <View style={styles.overlay}>
        </View>
        <View style={styles.body}>
          <Text style={styles.text}>{message}</Text>
          <View style={styles.btnWrapper}>
            {handleCancel &&
              <Button
                onPress={handleCancel}
                style={styles.btn}
              >
                <Text style={styles.text}>{COMMON_LANG.NO}</Text>
              </Button>
            }
            <Button
              onPress={handleOK}
              style={[styles.btn, { backgroundColor: COLOR.GOVERNOR_BAY }]}
            >
              <Text style={[styles.text, { color: COLOR.WHITE }]}>{COMMON_LANG.YES}</Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLOR.BLACK,
    opacity: 0.5,
  },
  body: {
    backgroundColor: COLOR.WHITE,
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 25,
    paddingLeft: 35,
    paddingRight: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnWrapper: {
    width: '100%',
    marginTop: 25,
    marginBottom: 10,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  btn: {
    flex: 1,
    borderWidth: 3,
    padding: 5,
    marginRight: 10,
    marginLeft: 10,
    borderColor: COLOR.GOVERNOR_BAY,
    borderRadius: 100,
    backgroundColor: COLOR.WHITE,
  },
  text: {
    fontSize: 18,
    color: COLOR.BLACK,
    textAlign: 'center',
  },
});
