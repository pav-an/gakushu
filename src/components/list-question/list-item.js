import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import styles from './styles';
import { ImageLoader, ImageText, Button } from '../common';
import { COLOR } from '../../constants';

class QuestionItem extends PureComponent {
  static propTypes = {
    question: PropTypes.object,
    onPressItem: PropTypes.func,
    selected: PropTypes.bool,
  }

  _onPress = () => {
    this.props.onPressItem(this.props.question.id);
  };

  render() {
    const { question, selected } = this.props;
    if (question.id < 3) {
      return <View style={styles.item} />
    }
    return (
      <Button
        style={[styles.item, styles.itemBorder]}
        onPress={this._onPress}
      >
        {question.question_image_url !== '' ?
          <ImageLoader
            link={question.question_image_url}
            aspectRatio={1}
          />
          :
          <ImageText
            text={question.question_text}
            aspectRatio={1}
          />
        }
        {selected ?
          <View style={StyleSheet.absoluteFill}>
            <View style={styles.redOverlay}></View>
            <View style={styles.itemWrapper}>
              <FontAwesome name='trash' size={30} color={COLOR.WHITE}/>
            </View>
          </View>
          :
          null
        }
      </Button>
    );
  }
}

export default class QuestionList extends PureComponent {
  static propTypes = {
    list: PropTypes.array.isRequired,
    selected: PropTypes.object.isRequired,
    onPressItem: PropTypes.func.isRequired,
    deleteMode: PropTypes.bool.isRequired,
  };

  _keyExtractor = item => item.id;

  _renderItem = ({ item }) => {
    const { onPressItem, selected } = this.props;
    return <QuestionItem
      onPressItem={onPressItem}
      question={item}
      selected={selected[ item.id ]}
    />;
  };

  render() {
    const { list, selected } = this.props;
    const listClone = [...list];
    for (var i = 1; i <= (listClone.length % 3); i++) {
      listClone.push({ id: i });
    }
    return (
      <FlatList
        numColumns={3}
        data={listClone}
        extraData={selected}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        style={styles.flatList}
      />
    );
  }
}
