import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View } from 'react-native';

import styles from './styles';
import { ImageLoader, ImageText } from '../common';
import { STATUS_LOADING } from '../../constants';
import { isStatusLoading } from '../../utils';

class QuestionItem extends PureComponent {
  static propTypes = {
    question: PropTypes.object.isRequired,
  };

  render() {
    const { question } = this.props;
    return (
      <View style={styles.item}>
        {question.question_image_url !== '' ?
          <ImageLoader
            link={question.question_image_url}
            aspectRatio={1}
          />
          :
          <ImageText
            text={question.question_text}
            aspectRatio={1}
            fontSize={17}
          />
        }
      </View>
    );
  }
}

class LoadingItem extends PureComponent {
  render() {
    return (
      <View style={styles.item}>
        <ImageLoader
          link={''}
          status={STATUS_LOADING}
          aspectRatio={1}
        />
      </View>
    );
  }
}

export default class RecentIncorrect extends PureComponent {
  static propTypes = {
    list: PropTypes.array.isRequired,
    status: PropTypes.string.isRequired,
  };

  _keyExtractor = item => item.id;

  _renderItem = ({ item }) => {
    if (item.isLoading) {
      return <LoadingItem />;
    }
    return <QuestionItem
      question={item}
    />;
  };

  render() {
    const { status } = this.props;
    let list = [];
    if (isStatusLoading(status)) {
      list = [{ id: '0', isLoading: true }];
    } else {
      list = this.props.list;
    }
    return (
      <FlatList
        horizontal={true}
        data={list}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        style={styles.flatList}
      />
    );
  }
}
