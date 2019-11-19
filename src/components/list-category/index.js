import React, { Component } from 'react';
import { View, TextInput, Platform, Keyboard, ActivityIndicator } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './styles';
import ListItem from './list-item';
import { NavBar, Button, ConfirmModal } from '../common';
import { CategoryActions, TagActions } from '../../actions';
import { isStatusLoading } from '../../utils';
import { COLOR, CATEGORY_LANG } from '../../constants';

const mapStateToProps = state => ({
  categories: state.categories,
  listStatus: state.status.listCategory,
  uploadStatus: state.status.uploadCategory,
  removeStatus: state.status.removeCategory,
});
const mapDispatchToProps = dispatch => ({
  listCategory: () => dispatch(CategoryActions.listCategory()),
  listTag: () => dispatch(TagActions.listTag()),
  uploadCategory: data => dispatch(CategoryActions.uploadCategory(data)),
  removeCategory: categoryId => dispatch(CategoryActions.removeCategory(categoryId)),
});

class CategoryManage extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    categories: PropTypes.array.isRequired,
    listStatus: PropTypes.string.isRequired,
    uploadStatus: PropTypes.string.isRequired,
    removeStatus: PropTypes.string.isRequired,
    listCategory: PropTypes.func.isRequired,
    listTag: PropTypes.func.isRequired,
    uploadCategory: PropTypes.func.isRequired,
    removeCategory: PropTypes.func.isRequired,
  };
  static navigationOptions = {
    title: CATEGORY_LANG.TITLE,
  };

  state = {
    inputAddText: '',
    inputEditText: '',
    modalDisplay: false,
    keyboardHeight: 0,
    isFocusInputEdit: false,
  };

  curCategoryId;

  constructor(props) {
    super(props);
    this.inputAddRef = React.createRef();
    this.inputEditRef = React.createRef();
  }

  componentDidMount() {
    this.props.listTag();
    this.props.listCategory();
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

    this.props.uploadCategory({ name: inputAddText });

    this.setState({ inputAddText: '' });
    Keyboard.dismiss();
  };

  _handleConfirmCancel = () => {
    this.setState({ modalDisplay: false });
  };

  _handleConfirmOK = () => {
    this.props.removeCategory(this.curCategoryId);
    this.curCategoryId = '';

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
    const curCategory = this._getCurCategory();
    this.props.uploadCategory({
      ...curCategory,
      name: inputEditText,
    });
    Keyboard.dismiss();
  };

  _handleOnAddInputChange = inputAddText => this.setState({ inputAddText });

  _handleOnEditInputChange = inputEditText => this.setState({ inputEditText });

  _onPressItem = categoryId => {
    this.props.navigation.navigate('ListQuestion', { categoryId });
  };

  _onPressEdit = categoryId => {
    this.curCategoryId = categoryId;
    this.inputAddRef.current.focus();

    const curCategory = this._getCurCategory();
    this.setState({
      inputEditText: curCategory.name,
      isFocusInputEdit: true,
    }, () => {
      this.inputEditRef.current.focus();
    });
  };

  _onPressDelete = categoryId => {
    this.curCategoryId = categoryId;
    this.setState({ modalDisplay: true });
  };

  _getCurCategory = () => {
    return this.props.categories.find(category => category.id === this.curCategoryId);
  }

  render() {
    const { inputAddText, inputEditText, keyboardHeight, modalDisplay, isFocusInputEdit } = this.state;
    const { navigation, categories, listStatus } = this.props;

    const bottomEditInputContainer = isFocusInputEdit && keyboardHeight ? keyboardHeight : '100%';

    return (
      <View style={styles.container}>
        <NavBar
          navigation={navigation}
          title={CATEGORY_LANG.TITLE}
        />
        <View style={styles.addInputContainer}>
          <TextInput
            ref={this.inputAddRef}
            value={inputAddText}
            onChangeText={this._handleOnAddInputChange}
            autoCorrect={false}
            style={styles.addInput}
            placeholder={CATEGORY_LANG.ADD_INPUT_PLACEHOLDER}
          />
          <Button onPress={this._handleAddPress} style={styles.addBtn}>
            <Ionicons name='ios-add-circle-outline' size={40} color={COLOR.GREEN} />
          </Button>
        </View>
        {isStatusLoading(listStatus) ?
          <ActivityIndicator />
          :
          <ListItem
            list={categories}
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
          message={CATEGORY_LANG.CONFIRM_DELETE_MESSAGE}
        />
      </View>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CategoryManage);
