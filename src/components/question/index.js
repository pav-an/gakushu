import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, View, Keyboard, ActivityIndicator } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { connect } from 'react-redux';
import { debounce } from 'lodash';

import styles, { FULL_ANSWER_TOP } from './styles';
import Answer from './answer';
import QuestionText from './question-text';
import QuestionImage from './question-image';
import { NavBar, Button, Text, Filter } from '../common';
import { QuestionActions } from '../../actions';
import { isStatusLoading, isStatusSuccess } from '../../utils';
import { getLocalQuestion, saveLocalQuestion } from '../../utils/local-question';
import { APP_CONST, QUESTION_LANG, COLOR } from '../../constants';

const SAVE_PROPERTIES = ['questionUri', 'questionRawUri', 'questionMaskUri', 'answerUri', 'inputText', 'inputAnswerText', 'difficulty', 'keyboardHeight', 'tagIds', 'categoryIds'];

const mapStateToProps = state => ({
  tags: state.tags,
  categories: state.categories,
  uploadStatus: state.status.uploadQuestion,
});
const mapDispatchToProps = dispatch => ({
  uploadQuestion: data => dispatch(QuestionActions.uploadQuestion(data)),
});

class Question extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    tags: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    uploadStatus: PropTypes.string.isRequired,
    uploadQuestion: PropTypes.func.isRequired,
  };

  answer = React.createRef();
  questionImage = React.createRef();
  filter = React.createRef();

  questionId = '';

  state = {
    isAnswerDisplay: false,
    questionLoading: false,
    questionUri: '',
    questionRawUri: '',
    questionMaskUri: '',
    answerUri: '',
    inputText: '',
    inputAnswerText: '',
    difficulty: 0,
    keyboardHeight: 0,
    tagIds: [],
    categoryIds: [],

    isImageAnswerLoading: false,
    isImageQuestionLoading: false,
    isRawImageQuestionLoading: false,
  }

  constructor(props) {
    super(props);
    this._saveLocal = debounce(this._saveLocal, 1000);
    if (!props.navigation.state.params) {
      this._loadLocal();
      return;
    }

    const question = props.navigation.state.params.question;
    this.questionId = question.id;
    this.state.difficulty = question.difficulty;
    this.state.inputText = question.question_text;
    this.state.tagIds = question.tag_ids;
    this.state.categoryIds = question.category_ids;
    if (question.type === APP_CONST.TYPE_TEXT_ANSWER) {
      this.state.inputAnswerText = question.answer;
    } else {
      this.state.answerUri = question.answer;
    }
    if (question.question_image_url) {
      this.state.questionLoading = true;
      this.state.questionUri = question.question_image_url;
    }
  }

  componentDidMount () {
    if (Platform.OS === 'ios') {
      this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardShow);
      this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardHide);
    } else {
      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardShow);
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardHide);
    }

    this.filter.current.set(this.state.tagIds, this.state.categoryIds);

    if (!this.props.navigation.state.params) {
      return;
    }

    const question = this.props.navigation.state.params.question;
    if (!question.question_image_url || !question.question_raw_image_url) {
      return;
    }

    const promises = [];
    promises.push(FileSystem.downloadAsync(
      question.question_raw_image_url,
      FileSystem.documentDirectory + 'question_raw_image.png'
    ));
    Promise.all(promises)
      .then(result => {
        this.setState({
          questionRawUri: result[ 0 ].uri,
          questionLoading: false,
        })
      });
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  componentWillReceiveProps(nextProps) {
    const { navigation, uploadStatus } = this.props;
    if (isStatusSuccess(uploadStatus, nextProps.uploadStatus)) {
      this.isSuccess = true;
      saveLocalQuestion('');
      navigation.goBack(null);
    }
  }

  componentWillUpdate() {
    if (!this.questionId) {
      this._saveLocal();
    }
  }

  _saveLocal = () => {
    if (this.isSuccess) {
      return;
    }
    const question = {};
    SAVE_PROPERTIES.forEach(key => {
      question[ key ] = this.state[ key ];
    });
    saveLocalQuestion(question);
  }

  _loadLocal = async () => {
    const localQuestion = await getLocalQuestion();
    if (!localQuestion) {
      return;
    }
    const { tags, categories } = this.props;
    localQuestion.tagIds = localQuestion.tagIds.filter(tagId => {
      return tags.findIndex(tag => tag.id === tagId) !== -1;
    });
    localQuestion.categoryIds = localQuestion.categoryIds.filter(categoryId => {
      return categories.findIndex(category => category.id === categoryId) !== -1;
    });
    this.filter.current.set(localQuestion.tagIds, localQuestion.categoryIds);
    this.setState(localQuestion);
  }

  _keyboardShow = event => {
    this.setState({ keyboardHeight: event.endCoordinates.height });
  }

  _keyboardHide = () => {
    this.setState({ keyboardHeight: 0 });
  }

  _onChangeUri = obj => {
    const newState = {};
    for (let key in obj) {
      switch (key) {
        case 'origin':
          newState.questionUri = obj[ key ];
          newState.questionRawUri = obj[ key ];
          break;
        case 'masked':
          newState.questionMaskUri = obj[ key ];
          if (obj[ key ]) {
            newState.answerUri = this.state.questionUri;
          }
          break;
        case 'raw':
          newState.questionRawUri = obj[ key ];
          break;
      }
    }
    this.setState(newState);
  }

  _getQuestionUri = () => {
    const { questionUri, questionMaskUri, questionRawUri } = this.state;
    return {
      origin: questionUri,
      masked: questionMaskUri,
      raw: questionRawUri,
    };
  }

  _isLoading = () => {
    const { questionLoading, isImageAnswerLoading, isImageQuestionLoading, isRawImageQuestionLoading } = this.state;
    return questionLoading || isImageAnswerLoading || isImageQuestionLoading || isRawImageQuestionLoading;
  }

  _handleFilterOpen = () => {
    this.filter.current.open();
  };

  _handleFilterDone = (tagIds, categoryIds) => {
    this.setState({ tagIds, categoryIds });
  };

  _handleOnDoneQuestion = async () => {
    const { inputText, inputAnswerText, difficulty, tagIds, categoryIds } = this.state;
    const data = {
      id: this.questionId,
      questionText: inputText,
      answerText: inputAnswerText,
      difficulty,
      tagIds,
      categoryIds,
    };
    if (this.state.questionUri) {
      const [uri, rawUri] = await this.questionImage.current.getUri();
      data.questionUri = uri;
      data.rawQuestionUri = rawUri;
    }
    data.answerUri = await this.answer.current.getUri();
    this.props.uploadQuestion(data);
  }

  _renderOverlay() {
    const { uploadStatus } = this.props;
    if (isStatusLoading(uploadStatus)) {
      return <View style={styles.overlay}></View>;
    }
    return null;
  }

  _renderAnswerOverlay() {
    const { isAnswerDisplay } = this.state;
    if (isAnswerDisplay) {
      return <View style={[styles.overlay, { zIndex: 0, top: FULL_ANSWER_TOP }]}></View>;
    }
    return null;
  }

  _renderNavBar() {
    const { navigation, uploadStatus } = this.props;
    const { questionUri, inputText, answerUri, inputAnswerText, tagIds, categoryIds } = this.state;
    const isLoading = this._isLoading();
    const badgeCount = tagIds.length + categoryIds.length;

    let btnDone = null;
    const condition = (questionUri !== '' || inputText !== '') && (answerUri !== '' || inputAnswerText !== '');
    if (condition) {
      if (isStatusLoading(uploadStatus) || isLoading) {
        btnDone = <View style={styles.btnNavbar}>
          <ActivityIndicator />
        </View>
      } else {
        btnDone = <Button
          style={styles.btnNavbar}
          onPress={this._handleOnDoneQuestion}
          startDelayTime={1000}
        >
          <Ionicons name='md-checkbox-outline' size={50} color={COLOR.GOVERNOR_BAY}/>
        </Button>
      }
    }
    return (
      <NavBar
        navigation={navigation}
        title={!this.questionId ? QUESTION_LANG.TITLE : QUESTION_LANG.EDIT_MODE_TITLE}
      >
        <Button
          style={styles.btnNavbar}
          onPress={this._handleFilterOpen}
        >
          <Feather name='filter' size={35} color={COLOR.GOVERNOR_BAY}/>
          {badgeCount > 0 && 
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {badgeCount}
              </Text>
            </View>
          }
        </Button>
        {btnDone}
      </NavBar>
    );
  }

  _renderAnswer() {
    const { inputAnswerText, answerUri, questionUri, isAnswerDisplay } = this.state;
    const isLoading = this._isLoading();
    return <Answer
      ref={this.answer}
      text={inputAnswerText}
      uri={answerUri}
      questionUri={questionUri}
      isLoading={isLoading}
      isDisplay={isAnswerDisplay}
      onChangeText={inputAnswerText => this.setState({ inputAnswerText })}
      onChangeUri={answerUri => this.setState({ answerUri })}
      onChangeImageLoading={isImageAnswerLoading => this.setState({ isImageAnswerLoading })}
      onChangeDisplay={isAnswerDisplay => this.setState({ isAnswerDisplay })}
    />;
  }

  _renderQuestionText() {
    const { difficulty, keyboardHeight, isAnswerDisplay, inputText } = this.state;
    return <QuestionText
      text={inputText}
      difficulty={difficulty}
      keyboardHeight={keyboardHeight}
      isAnswerDisplay={isAnswerDisplay}
      onChangeText={inputText => this.setState({ inputText })}
      onChangeUri={this._onChangeUri}
      onChangeDifficulty={difficulty => this.setState({ difficulty })}
    />;
  }

  _renderQuestionImage() {
    const { difficulty, isAnswerDisplay, inputText } = this.state;
    const isLoading = this._isLoading();
    return <QuestionImage
      ref={this.questionImage}
      isAnswerDisplay={isAnswerDisplay}
      isLoading={isLoading}
      text={inputText}
      uri={this._getQuestionUri()}
      difficulty={difficulty}
      onChangeText={inputText => this.setState({ inputText })}
      onChangeUri={this._onChangeUri}
      onChangeDifficulty={difficulty => this.setState({ difficulty })}
      onChangeImageLoading={isImageQuestionLoading => this.setState({ isImageQuestionLoading })}
      onChangeRawImageLoading={isRawImageQuestionLoading => this.setState({ isRawImageQuestionLoading })}
    />;
  }

  _renderFilter() {
    return <Filter
      ref={this.filter}
      handleDone={this._handleFilterDone}
      containerStyle={{ zIndex: 2 }}
    />
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.absoluteContainer} />
        {this._renderNavBar()}
        {this.state.questionUri ?
          this._renderQuestionImage()
          :
          this._renderQuestionText()
        }
        {this._renderAnswer()}
        {this._renderFilter()}
        {this._renderAnswerOverlay()}
        {this._renderOverlay()}
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Question);
