import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Animated, Easing, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

import styles from './styles';
import ListItem from './list-item';
import Text from '../text';
import Button from '../button';
import { isStatusLoading } from '../../../utils';
import { COMMON_LANG } from '../../../constants';

const mapStateToProps = state => ({
  tags: state.tags,
  categories: state.categories,
  listTagStatus: state.status.listTag,
  listCategoryStatus: state.status.listCategory,
});

class Filter extends Component {
  static propTypes = {
    tags: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    listTagStatus: PropTypes.string.isRequired,
    listCategoryStatus: PropTypes.string.isRequired,
    handleDone: PropTypes.func,
    containerStyle: PropTypes.object,
  };

  state = {
    activeTags: {},
    activeCategories: {},
  };

  xValue = new Animated.Value(1000);

  componentWillReceiveProps(nextProps) {
    const { categories, tags, handleDone } = this.props;
    if ((categories.length !== 0 && categories.length !== nextProps.categories.length) || 
      (tags.length !== 0 && tags.length !== nextProps.tags.length)) {
      this.setState({
        activeTags: {},
        activeCategories: {},
      });
      if (handleDone) {
        handleDone([], []);
      }
    }
  }

  open = () => {
    this._animate(0);
  };

  hide = () => {
    this._animate(this.containerWidth);
  }

  set = (tagIds = [], categoryIds = []) => {
    const activeTags = {};
    const activeCategories = {};
    tagIds.forEach(tagId => {
      activeTags[ tagId ] = true;
    });
    categoryIds.forEach(categoryId => {
      activeCategories[ categoryId ] = true;
    });
    this.setState({
      activeTags,
      activeCategories,
    });
  }

  setFilterByTagId = tagId => {
    let activeTags = {};
    let resTagIds = [];
    if (tagId !== 'all') {
      activeTags = { [ tagId ]: true }; 
      resTagIds = [tagId];
    }
    this.setState({
      activeTags,
      activeCategories: {},
    });
    this.props.handleDone(resTagIds, []);
  }

  setFilterByCategoryId = categoryId => {
    let activeCategories = {};
    let resCategoryIds = [];
    if (categoryId !== 'all') {
      activeCategories = { [ categoryId ]: true };
      resCategoryIds = [categoryId]
    }
    this.setState({
      activeTags: {},
      activeCategories,
    });
    this.props.handleDone([], resCategoryIds);
  }

  _animate = value => {
    if (this.isAnimating) {
      return;
    }
    this.isAnimating = true;
    Animated.timing(this.xValue, {
      toValue: value,
      duration: 250,
      easing: Easing.inout,
      useNativeDriver: true,
    }).start(() => {
      this.isAnimating = false;
    });
  }

  _onPressTag = id => {
    this.setState(state => ({
      activeTags: {
        ...state.activeTags,
        [ id ]: !state.activeTags[ id ],
      },
    }));
  };

  _onPressCategory = id => {
    this.setState(state => ({
      activeCategories: {
        ...state.activeCategories,
        [ id ]: !state.activeCategories[ id ],
      },
    }));
  };

  _handleDonePress = () => {
    const { handleDone } = this.props;
    this.hide();
    if (handleDone) {
      const { activeTags, activeCategories } = this.state;
      const tagIds = Object.keys(activeTags).filter(id => activeTags[ id ]);
      const categoryIds = Object.keys(activeCategories).filter(id => activeCategories[ id ]);
      handleDone(tagIds, categoryIds);
    }
  }

  _handleClearPress = () => {
    this.setState({
      activeTags: {},
      activeCategories: {},
    });
  }

  _handleContainerOnLayout = event => {
    this.containerWidth = event.nativeEvent.layout.width;
    this.xValue.setValue(this.containerWidth);
    this.forceUpdate();
  }

  _renderListTag() {
    const { tags, listTagStatus } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.selectedTextWrapper}>
          <Text style={styles.selectedText}>{COMMON_LANG.TAGS}:</Text>
        </View>
        {isStatusLoading(listTagStatus) ?
          <ActivityIndicator />
          :
          <ListItem
            list={tags}
            actives={this.state.activeTags}
            onPressItem={this._onPressTag}
          />
        }
      </View>
    )
  }

  _renderListCategory() {
    const { categories, listCategoryStatus } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.selectedTextWrapper}>
          <Text style={styles.selectedText}>{COMMON_LANG.CATEGORIES}:</Text>
        </View>
        {isStatusLoading(listCategoryStatus) ?
          <ActivityIndicator />
          :
          <ListItem
            list={categories}
            actives={this.state.activeCategories}
            onPressItem={this._onPressCategory}
          />
        }
      </View>
    )
  }

  _renderBottomBtn() {
    return (
      <View style={styles.bottomContainer}>
        <Button
          style={[ styles.btn, styles.btnWhite ]}
          onPress={this._handleClearPress}
        >
          <Text style={[ styles.btnText, styles.btnWhiteText ]}>{COMMON_LANG.CLEAR}</Text>
        </Button>
        <Button
          style={styles.btn}
          onPress={this._handleDonePress}
        >
          <Text style={styles.btnText}>{COMMON_LANG.DONE}</Text>
        </Button>
      </View>
    );
  }

  render() {
    return (
      <Animated.View
        style={[styles.container, { transform: [{ translateX: this.xValue }] }, this.props.containerStyle]}
        onLayout={this._handleContainerOnLayout}
      >
        <Button
          onPress={this.hide}
          style={{ flex: 1 }}
        />
        <View style={styles.body}>
          {this._renderListTag()}
          {this._renderListCategory()}
          {this._renderBottomBtn()}
        </View>
      </Animated.View>
    );
  }
}

export default connect(mapStateToProps, null, null, { forwardRef: true })(Filter);
