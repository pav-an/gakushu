import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import { FontAwesome, AntDesign, Feather } from '@expo/vector-icons';

import styles from './styles';
import { NavBar, Button, Text, Filter } from '../common';
import ListItem from './list-item'
import { QuestionActions } from '../../actions';
import { LIST_QUESTION_LANG } from '../../constants';
import { isStatusLoading } from '../../utils';

const mapStateToProps = state => ({
  questions: state.questions,
  listStatus: state.status.listQuestion,
});
const mapDispatchToProps = dispatch => ({
  listQuestion: params => dispatch(QuestionActions.listQuestion(params)),
  removeQuestions: questionIds => dispatch(QuestionActions.removeQuestions(questionIds)),
});

class ListQuestion extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    listStatus: PropTypes.string.isRequired,
    listQuestion: PropTypes.func.isRequired,
    removeQuestions: PropTypes.func.isRequired,
  };
  static navigationOptions = {
    title: LIST_QUESTION_LANG.TITLE,
  };

  state = {
    deleteMode: false,
    selected: {},
    filterTagIds: [],
    filterCategoryIds: [],
  }

  constructor(props) {
    super(props);
    this.filter = React.createRef();
  }

  componentDidMount() {
    this.props.listQuestion();
  }

  _handleScreenWillFocus = payload => {
    const { params } = payload.action;
    if (!params) {
      return;
    }
    const { tagId, categoryId } = params;
    if (tagId) {
      this.filter.current.setFilterByTagId(tagId);
    }
    if (categoryId) {
      this.filter.current.setFilterByCategoryId(categoryId);
    }
  }

  _handleAddQuestion = () => {
    this.props.navigation.navigate('Question');
  };

  _handleEditQuestion = async question => {
    this.props.navigation.navigate('Question', { question });
  };

  _handleOnDeletePress = () => {
    this.setState({
      deleteMode: !this.state.deleteMode,
      selected: {},
    });
  }

  _handleFilterOpen = () => {
    this.filter.current.open();
  }

  _handleFilterDone = (tagIds, categoryIds) => {
    this.setState({
      filterTagIds: tagIds,
      filterCategoryIds: categoryIds,
    });
    this.props.listQuestion({
      tagIds,
      categoryIds,
    });
  }

  _onPressItem = id => {
    const { selected, deleteMode } = this.state;
    const { questions } = this.props;
    if (deleteMode) {
      this.setState({
        selected: {
          ...selected,
          [ id ]: !selected[ id ],
        },
      });
    } else {
      const question = questions.find(question => question.id === id);
      this._handleEditQuestion(question);
    }
  };

  _handleConfirmDeleteOnPress = () => {
    const { selected } = this.state;
    const questionIds = [];
    for (var id in selected) {
      if (selected[ id ]) {
        questionIds.push(id);
      }
    }
    this.props.removeQuestions(questionIds);
    this.setState({
      deleteMode: false,
      selected: {},
    })
  }

  render() {
    const { navigation, listStatus, questions } = this.props;
    const { selected, deleteMode, filterTagIds, filterCategoryIds } = this.state;
    const title = `(${questions.length}) ${LIST_QUESTION_LANG.TITLE}`;
    const badgeCount = filterTagIds.length + filterCategoryIds.length;

    let numSelectedItem = 0;
    for (var id in selected) {
      if (selected[ id ]) {
        numSelectedItem++;
      }
    }

    return (
      <View style={styles.container}>
        <NavigationEvents onWillFocus={this._handleScreenWillFocus} />
        <NavBar
          navigation={navigation}
          title={title}
        />
        <View style={styles.toolBar}>
          <Button
            style={styles.toolbarBtn}
            onPress={this._handleFilterOpen}
          >
            <Feather name='filter' size={35} />
            {badgeCount > 0 && 
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {badgeCount}
                </Text>
              </View>
            }
          </Button>
          <Button
            style={styles.toolbarBtn}
            onPress={this._handleOnDeletePress}
            delayTime={0}
          >
            {deleteMode ?
              <Text style={styles.deleteText}>{LIST_QUESTION_LANG.NORMAL_MODE}</Text>
              :
              <FontAwesome name='trash' size={35} />
            }
          </Button>
          <View style={{ flex: 1 }} />
          <Button
            style={styles.toolbarBtn}
            onPress={this._handleAddQuestion}
          >
            <AntDesign name='pluscircleo' size={35} />
          </Button>
        </View>
        {isStatusLoading(listStatus) ?
          <ActivityIndicator />
          :
          <ListItem
            list={questions}
            selected={selected}
            onPressItem={this._onPressItem}
            deleteMode={deleteMode}
          />
        }
        {numSelectedItem !== 0 &&
          <Button
            style={styles.confirmDeleteBtn}
            onPress={this._handleConfirmDeleteOnPress}
          >
            <Text style={styles.confirmDeleteBtnText}>{LIST_QUESTION_LANG.CONFIRM_DELETE} ({numSelectedItem})</Text>
          </Button>
        }
        <Filter
          ref={this.filter}
          handleDone={this._handleFilterDone}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListQuestion);
