import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';

import styles from './styles';
import Text from '../text';
import { COLOR } from '../../../constants';

class Item extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    isActive: PropTypes.bool,
    onPressItem: PropTypes.func.isRequired,
  };

  _onPress = () => {
    this.props.onPressItem(this.props.data.id);
  };

  render() {
    const { data, isActive } = this.props;
    const activeStyle = isActive ? { backgroundColor: COLOR.VIOLET } : null;
    return <Text
      onPress={this._onPress}
      style={[styles.itemText, activeStyle]}
      numberOfLines={1}
      ellipsizeMode='middle'
    >
      {data.name}
    </Text>
  }
}

export default class ListItem extends PureComponent {
  static propTypes = {
    list: PropTypes.array.isRequired,
    actives: PropTypes.object.isRequired,
    onPressItem: PropTypes.func.isRequired,
  };

  _keyExtractor = item => item.id;

  _renderItem = ({ item }) => {
    const { actives, onPressItem } = this.props;
    const isActive = actives[ item.id ];
    return <Item
      data={item}
      isActive={isActive}
      onPressItem={onPressItem}
    />
  }

  render() {
    return <FlatList
      data={this.props.list}
      extraData={this.props.actives}
      keyExtractor={this._keyExtractor}
      renderItem={this._renderItem}
      numColumns={2}
      contentContainerStyle={styles.flatList}
    />
  }
}
