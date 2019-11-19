import React, { PureComponent } from 'react';
import { View, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import PropTypes from 'prop-types';

import styles from './styles';
import { Button, Text } from '../common';
import { COLOR, CATEGORY_LANG } from '../../constants';

class CategoryItem extends PureComponent {
  static propTypes = {
    category: PropTypes.object.isRequired,
    onPressItem: PropTypes.func.isRequired,
    onPressEdit: PropTypes.func.isRequired,
    onPressDelete: PropTypes.func.isRequired,
  };

  _handleItemPress = () => {
    this.props.onPressItem(this.props.category.id);
  }

  _handleEditPress = () => {
    this.props.onPressEdit(this.props.category.id);
  }

  _handleDeletePress = () => {
    this.props.onPressDelete(this.props.category.id);
  }

  render() {
    const { category } = this.props;
    const itemBodyAllStyle = category.id === 'all' ? styles.itemBodyAll : null;

    return (
      <View style={styles.item}>
        <View style={[ styles.itemBody, itemBodyAllStyle ]}>
          {category.id !== 'all' &&
            <Button onPress={this._handleEditPress}>
              <AntDesign name='edit' size={30} />
            </Button>
          }
          <Button
            onPress={this._handleItemPress}
            style={styles.itemTextWrapper}
          >
            <Text style={styles.itemText}>{category.name}</Text>
          </Button>
        </View>
        {category.id !== 'all' && 
          <Button
            style={styles.itemDeleteBtn}
            onPress={this._handleDeletePress}
          >
            <AntDesign name='delete' size={30} color={COLOR.TAMARILLO} />
          </Button>
        }
      </View>
    );
  }
}

export default class CategoryList extends PureComponent {
  static propTypes = {
    list: PropTypes.array.isRequired,
    onPressItem: PropTypes.func.isRequired,
    onPressEdit: PropTypes.func.isRequired,
    onPressDelete: PropTypes.func.isRequired,
  }

  _keyExtractor = item => item.id;

  _renderItem = ({ item }) => {
    return <CategoryItem
      category={item}
      onPressItem={this.props.onPressItem}
      onPressEdit={this.props.onPressEdit}
      onPressDelete={this.props.onPressDelete}
    />
  }

  render() {
    const list = [
      { id: 'all', name: CATEGORY_LANG.ALL_QUESTION },
      ...this.props.list,
    ]
    return <FlatList
      data={list}
      keyExtractor={this._keyExtractor}
      renderItem={this._renderItem}
      style={styles.flatList}
    />
  }
}
