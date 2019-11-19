import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { Entypo, FontAwesome, Feather, MaterialIcons } from '@expo/vector-icons';

import styles from './styles';
import { NavBar, Button, Text, ImageLoader, ImageText } from '../common';
import { PlayActions } from '../../actions';
import { isStatusLoading, isStatusSuccess } from '../../utils';
import { COLOR, PLAY_LANG, APP_CONST } from '../../constants';

const STEP_KNOW = 0;
const STEP_CORRECT = 1;

const mapStateToProps = state => ({
  playQuestion: state.playQuestion,
  nextQuestionStatus: state.status.getNextQuestion,
  saveAnswerStatus: state.status.saveAnswer,
});
const mapDispatchToProps = dispatch => ({
  getNextQuestion: () => dispatch(PlayActions.getNextQuestion()),
  saveAnswer: answer => dispatch(PlayActions.saveAnswer(answer)),
});

class Play extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    playQuestion: PropTypes.object,
    nextQuestionStatus: PropTypes.string.isRequired,
    saveAnswerStatus: PropTypes.string.isRequired,
    getNextQuestion: PropTypes.func.isRequired,
    saveAnswer: PropTypes.func.isRequired,
  };

  state = {
    step: STEP_KNOW,
    knowAnswer: false,
    correctAnswer: false,
  };

  componentDidMount () {
    this.props.getNextQuestion();
  }

  componentWillReceiveProps(nextProps) {
    const { navigation, saveAnswerStatus, getNextQuestion } = this.props;
    if (!nextProps.playQuestion) {
      navigation.goBack();
      return;
    }
    if (isStatusSuccess(saveAnswerStatus, nextProps.saveAnswerStatus)) {
      this.setState({
        step: STEP_KNOW,
        knowAnswer: false,
        correctAnswer: false,
      });
      getNextQuestion();
    }
  }

  _saveAnswer = () => {
    const { playQuestion } = this.props;
    const { knowAnswer, correctAnswer } = this.state;
    this.props.saveAnswer({
      question_id: playQuestion.id,
      know_answer: knowAnswer,
      answer_correct: correctAnswer,
    });
  }

  _handleKnowPress = () => {
    this.setState({
      step: STEP_CORRECT,
      knowAnswer: true,
    });
  }

  _handleUnknowPress = () => {
    this.setState({
      step: STEP_CORRECT,
      knowAnswer: false,
    });
  }

  _handleRightPress = () => {
    this.setState({
      correctAnswer: true,
    }, () => {
      this._saveAnswer();
    });
  }

  _handleWrongPress = () => {
    this.setState({
      correctAnswer: false,
    }, () => {
      this._saveAnswer();
    });
  }

  _handleNextQuestionPress = () => {
    this._saveAnswer();
  }

  _isLoading = () => {
    const { nextQuestionStatus, saveAnswerStatus } = this.props;
    return isStatusLoading(nextQuestionStatus) || isStatusLoading(saveAnswerStatus);
  }

  _renderStepKnow = () => {
    return (
      <View style={styles.answerWrapper}>
        <Button
          style={styles.btnAnswer}
          onPress={this._handleKnowPress}
          delayTime={0}
        >
          <View style={[styles.btnIconAnswer, styles.backgroundGreen]}>
            <FontAwesome name="lightbulb-o" size={50} color={COLOR.BLACK} />
          </View>
          <Text style={styles.btnTextAnswer}>{PLAY_LANG.KNOW}</Text>
        </Button>
        <Button
          style={styles.btnAnswer}
          onPress={this._handleUnknowPress}
          delayTime={0}
        >
          <View style={[styles.btnIconAnswer, styles.backgroundRed]}>
            <Entypo name="cross" size={50} color={COLOR.BLACK} />
          </View>
          <Text style={styles.btnTextAnswer}>{PLAY_LANG.UNKNOW}</Text>
        </Button>
      </View>
    )
  }

  _renderStepCorrectWithKnow = () => {
    return (
      <View style={styles.answerWrapper}>
        <Button
          style={styles.btnAnswer}
          onPress={this._handleRightPress}
          disabled={this._isLoading()}
        >
          <View style={[styles.btnIconAnswer, styles.backgroundGreen]}>
            <Feather name="check" size={50} color={COLOR.BLACK} />
          </View>
          <Text style={styles.btnTextAnswer}>{PLAY_LANG.KNOW_RIGHT}</Text>
        </Button>
        <Button
          style={styles.btnAnswer}
          onPress={this._handleWrongPress}
          disabled={this._isLoading()}
        >
          <View style={[styles.btnIconAnswer, styles.backgroundRed]}>
            <Entypo name="block" size={50} color={COLOR.BLACK} />
          </View>
          <Text style={styles.btnTextAnswer}>{PLAY_LANG.KNOW_WRONG}</Text>
        </Button>
      </View>
    );
  }

  _renderStepCorrectWithUnknow = () => {
    const { saveAnswerStatus } = this.props;
    return (
      <View style={styles.nextBtnWrapper}>
        <Button
          style={styles.nextBtn}
          onPress={this._handleNextQuestionPress}
          disabled={this._isLoading()}
        >
          {isStatusLoading(saveAnswerStatus) ?
            <ActivityIndicator />
            :
            <Text style={styles.nextBtnText}>{PLAY_LANG.NEXT}</Text>
          }
        </Button>
      </View>
    )
  }

  render() {
    const { nextQuestionStatus, playQuestion } = this.props;
    const { step, knowAnswer } = this.state;

    if (!playQuestion) {
      return null;
    }

    let imgLink = '', answerComponent, displayAnswerText = { opacity: 0 };
    if (step === STEP_KNOW) {
      imgLink = playQuestion.question_image_url;
      answerComponent = this._renderStepKnow();
    } else {
      if (playQuestion.type === APP_CONST.TYPE_TEXT_ANSWER) {
        imgLink = playQuestion.question_image_url;
        displayAnswerText = { opacity: 1 };
      } else {
        imgLink = playQuestion.answer;
      }
      if (knowAnswer) {
        answerComponent = this._renderStepCorrectWithKnow();
      } else {
        answerComponent = this._renderStepCorrectWithUnknow();
      }
    }

    let questionTextOneline = '';
    if (playQuestion.question_text) {
      questionTextOneline = playQuestion.question_text.replace(/\n/g, ' ');
    }

    return (
      <View style={styles.container}>
        <NavBar
          navigation={this.props.navigation}
          title={PLAY_LANG.TITLE}
        />
        <View style={styles.question}>
          <FontAwesome name="question-circle" color={COLOR.GOVERNOR_BAY} size={30}/>
          {playQuestion.question_image_url !== '' &&
            <ScrollView horizontal={true}>
              <Text style={styles.questionText}>
                {questionTextOneline}
              </Text>
            </ScrollView>
          }
        </View>
        {imgLink !== '' ?
          <ImageLoader
            link={imgLink}
            status={nextQuestionStatus}
            aspectRatio={1.33}
            containerStyle={styles.imageContainer}
          />
          :
          <ImageText
            text={playQuestion.question_text}
            status={nextQuestionStatus}
            aspectRatio={1.33}
            containerStyle={styles.imageContainer}
            fontSize={30}
          />
        }
        {playQuestion.type === APP_CONST.TYPE_TEXT_ANSWER &&
          <View style={[styles.answerTextWrapper, displayAnswerText]}>
            <View style={styles.answerHintWrapper}>
              <MaterialIcons name="question-answer" color={COLOR.GOVERNOR_BAY} size={20} />
              <Text style={styles.answerHint}>{PLAY_LANG.ANSWER_HINT}</Text>
            </View>
            <ScrollView horizontal={true}>
              <Text style={styles.answerText} numberOfLines={1}>{playQuestion.answer}</Text>
            </ScrollView>
          </View>
        }
        <View style={{ flex: 1 }}></View>
        {answerComponent}
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Play);
