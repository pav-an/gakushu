import React, { PureComponent } from 'react';
import { View, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import PropTypes from 'prop-types';

import styles from './styles';
import { Button, Text } from '../common';
import { COLOR, TAG_LANG } from '../../constants';

class TagItem extends PureComponent {
  static propTypes = {
    tag: PropTypes.object.isRequired,
    onPressItem: PropTypes.func.isRequired,
    onPressEdit: PropTypes.func.isRequired,
    onPressDelete: PropTypes.func.isRequired,
  };

  _handleItemPress = () => {
    this.props.onPressItem(this.props.tag.id);
  }

  _handleEditPress = () => {
    this.props.onPressEdit(this.props.tag.id);
  }

  _handleDeletePress = () => {
    this.props.onPressDelete(this.props.tag.id);
  }

  render() {
    const { tag } = this.props;
    const itemBodyAllStyle = tag.id === 'all' ? styles.itemBodyAll : null;

    return (
      <View style={styles.item}>
        <View style={[ styles.itemBody, itemBodyAllStyle ]}>
          {tag.id !== 'all' &&
            <Button onPress={this._handleEditPress}>
              <AntDesign name='edit' size={30} />
            </Button>
          }
          <Button
            onPress={this._handleItemPress}
            style={styles.itemTextWrapper}
          >
            <Text style={styles.itemText}>{tag.name}</Text>
          </Button>
        </View>
        {tag.id !== 'all' &&
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

export default class TagList extends PureComponent {
  static propTypes = {
    list: PropTypes.array.isRequired,
    onPressItem: PropTypes.func.isRequired,
    onPressEdit: PropTypes.func.isRequired,
    onPressDelete: PropTypes.func.isRequired,
  }

  _keyExtractor = item => item.id;

  _renderItem = ({ item }) => {
    return <TagItem
      tag={item}
      onPressItem={this.props.onPressItem}
      onPressEdit={this.props.onPressEdit}
      onPressDelete={this.props.onPressDelete}
    />
  }

  render() {
    const list = [
      { id: 'all', name: TAG_LANG.ALL_QUESTION },
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
