import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import styles from './styles';
import Mask from './mask';
import { NavBar, Button, Text } from '../common';
import { QUESTION_LANG, COMMON_LANG } from '../../constants';

export default class QuestionMask extends Component {
  static propTypes = {
    rawUri: PropTypes.string.isRequired,
    preMaskedUri: PropTypes.string.isRequired,
    onChangeUri: PropTypes.func.isRequired,
  };

  state = {
    isOpen: false,
  };

  mask = React.createRef();

  open = (rotateValue = 0) => {
    this.setState({ isOpen: true });
    this.mask.current.adjust(rotateValue);
  }

  getRotate = () => {
    return this.mask.current.rotate;
  }

  _handleMaskDone = async () => {
    const resultUri = await this.mask.current.takeScreenshot();
    this.props.onChangeUri(resultUri);

    // check point line stack
    this.mask.current.checkPoint();
    this.setState({ isOpen: false });
  }

  _handleOnBackMask = () => {
    this.mask.current.refresh();
    this.setState({ isOpen: false });
  }

  render () {
    const { rawUri, preMaskedUri } = this.props;
    const { isOpen } = this.state;
    const zIndex = isOpen ? 2 : -1;
    return (
      <View style={[styles.absoluteContainer, { zIndex }]}>
        <NavBar
          title={QUESTION_LANG.MASK_TITLE}
          onBack={this._handleOnBackMask}
          isTextBtn={true}
        >
          <Button
            style={[styles.btnDoneNavbar, { marginRight: 5 }]}
            onPress={this._handleMaskDone}
          >
            <Text style={styles.btnDoneNavbarText}>{COMMON_LANG.DONE}</Text>
          </Button>
        </NavBar>
        {preMaskedUri !== '' && 
          <Mask
            ref={this.mask}
            key={preMaskedUri}
            imageUri={preMaskedUri}
            imageRawUri={rawUri}
          />
        }
      </View>
    );
  }
}
