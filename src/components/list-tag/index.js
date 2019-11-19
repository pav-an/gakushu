import React, { Component } from 'react';
import { View, TextInput, Platform, Keyboard, ActivityIndicator } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './styles';
import ListItem from './list-item';
import { NavBar, Button, ConfirmModal } from '../common';
import { TagActions } from '../../actions';
import { isStatusLoading } from '../../utils';
import { COLOR, TAG_LANG } from '../../constants';

const mapStateToProps = state => ({
  tags: state.tags,
  listStatus: state.status.listTag,
  uploadStatus: state.status.uploadTag,
  removeStatus: state.status.removeTag,
});
const mapDispatchToProps = dispatch => ({
  uploadTag: data => dispatch(TagActions.uploadTag(data)),
  removeTag: tagId => dispatch(TagActions.removeTag(tagId)),
});

class TagManage extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    tags: PropTypes.array.isRequired,
    listStatus: PropTypes.string.isRequired,
    uploadStatus: PropTypes.string.isRequired,
    removeStatus: PropTypes.string.isRequired,
    uploadTag: PropTypes.func.isRequired,
    removeTag: PropTypes.func.isRequired,
  };
  static navigationOptions = {
    title: TAG_LANG.TITLE,
  };

  state = {
    inputAddText: '',
    inputEditText: '',
    modalDisplay: false,
    keyboardHeight: 0,
    isFocusInputEdit: false,
  };

  curTagId;

  constructor(props) {
    super(props);
    this.inputAddRef = React.createRef();
    this.inputEditRef = React.createRef();
  }

  componentDidMount() {
    if (Platform.OS === 'ios') {
      this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardShow);
      this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardHide);
    } else {
      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardShow);
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardHide);
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardShow = event => {
    this.setState({ keyboardHeight: event.endCoordinates.height });
  };

  _keyboardHide = () => {
    this.setState({ keyboardHeight: 0 });
  };

  _handleAddPress = () => {
    const { inputAddText } = this.state;
    if (!inputAddText) {
      return;
    }

    this.props.uploadTag({ name: inputAddText });

    this.setState({ inputAddText: '' });
    Keyboard.dismiss();
  };

  _handleConfirmCancel = () => {
    this.setState({ modalDisplay: false });
  };

  _handleConfirmOK = () => {
    this.props.removeTag(this.curTagId);
    this.curTagId = '';

    this.setState({ modalDisplay: false });
  };

  _handleInputEditClear = () => {
    if (!this.state.inputEditText) {
      return;
    }
    this.setState({ inputEditText: '' });
  };

  _handleInputEditBlur = () => {
    this.setState({ isFocusInputEdit: false });
  };

  _handleInputEditDonePress = () => {
    const { inputEditText } = this.state;
    if (!inputEditText) {
      return;
    }
    const curTag = this._getCurTag();
    this.props.uploadTag({
      ...curTag,
      name: inputEditText,
    });
    Keyboard.dismiss();
  };

  _handleOnAddInputChange = inputAddText => this.setState({ inputAddText });

  _handleOnEditInputChange = inputEditText => this.setState({ inputEditText });

  _onPressItem = tagId => {
    this.props.navigation.navigate('ListQuestion', { tagId });
  };

  _onPressEdit = tagId => {
    this.curTagId = tagId;
    this.inputAddRef.current.focus();

    const curTag = this._getCurTag();
    this.setState({
      inputEditText: curTag.name,
      isFocusInputEdit: true,
    }, () => {
      this.inputEditRef.current.focus();
    });
  };

  _onPressDelete = tagId => {
    this.curTagId = tagId;
    this.setState({ modalDisplay: true });
  };

  _getCurTag = () => {
    return this.props.tags.find(tag => tag.id === this.curTagId);
  }

  render() {
    const { inputAddText, inputEditText, keyboardHeight, modalDisplay, isFocusInputEdit } = this.state;
    const { navigation, tags, listStatus } = this.props;

    const bottomEditInputContainer = isFocusInputEdit && keyboardHeight ? keyboardHeight : '100%';

    return (
      <View style={styles.container}>
        <NavBar
          navigation={navigation}
          title={TAG_LANG.TITLE}
        />
        <View style={styles.addInputContainer}>
          <TextInput
            ref={this.inputAddRef}
            value={inputAddText}
            onChangeText={this._handleOnAddInputChange}
            autoCorrect={false}
            style={styles.addInput}
            placeholder={TAG_LANG.ADD_INPUT_PLACEHOLDER}
          />
          <Button onPress={this._handleAddPress} style={styles.addBtn}>
            <Ionicons name='ios-add-circle-outline' size={40} color={COLOR.GREEN} />
          </Button>
        </View>
        {isStatusLoading(listStatus) ?
          <ActivityIndicator />
          :
          <ListItem
            list={tags}
            onPressItem={this._onPressItem}
            onPressEdit={this._onPressEdit}
            onPressDelete={this._onPressDelete}
          />
        }
        <View style={[styles.editInputContainer, { bottom: bottomEditInputContainer }]}>
          <Button onPress={this._handleInputEditClear}>
            <AntDesign name='closecircleo' size={30} color={COLOR.TAMARILLO} />
          </Button>
          <TextInput
            ref={this.inputEditRef}
            value={inputEditText}
            onChangeText={this._handleOnEditInputChange}
            onBlur={this._handleInputEditBlur}
            autoCorrect={false}
            style={styles.editInput}
          />
          <Button onPress={this._handleInputEditDonePress}>
            <AntDesign name='checkcircleo' size={30} color={COLOR.GREEN} />
          </Button>
        </View>
        <ConfirmModal
          isDisplay={modalDisplay}
          handleOK={this._handleConfirmOK}
          handleCancel={this._handleConfirmCancel}
          message={TAG_LANG.CONFIRM_DELETE_MESSAGE}
        />
      </View>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(TagManage);
