import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { EvilIcons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { NavigationEvents } from 'react-navigation';

import styles from './styles';
import { NavBar, Button, Text, ConfirmModal } from '../common';
import RecentIncorrect from './recent-incorrect';
import { HistoryActions, PlayActions } from '../../actions';
import { isStatusLoading, isStatusSuccess } from '../../utils';
import { QUIZ_LANG, COLOR } from '../../constants';

const mapStateToProps = state => ({
  history: state.history,
  playQuestion: state.playQuestion,
  historyStatus: state.status.getLearningHistory,
  resetStatus: state.status.resetLearningHistory,
  nextQuestionStatus: state.status.getNextQuestion,
});
const mapDispatchToProps = dispatch => ({
  resetLearningHistory: () => dispatch(HistoryActions.resetLearningHistory()),
  getLearningHistory: () => dispatch(HistoryActions.getLearningHistory()),
  getNextQuestion: isCheck => dispatch(PlayActions.getNextQuestion(isCheck)),
  setExcludeUnanswered: exclude => dispatch(HistoryActions.setExcludeUnanswered(exclude)),
});

class Quiz extends Component {
  static propTypes = {
    resetLearningHistory: PropTypes.func.isRequired,
    getLearningHistory: PropTypes.func.isRequired,
    getNextQuestion: PropTypes.func.isRequired,
    setExcludeUnanswered: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    playQuestion: PropTypes.object,
    historyStatus: PropTypes.string.isRequired,
    resetStatus: PropTypes.string.isRequired,
    nextQuestionStatus: PropTypes.string.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  state = {
    modalDisplay: false,
  };

  componentWillReceiveProps(nextProps) {
    const { resetStatus, getLearningHistory, getNextQuestion } = this.props;
    if (isStatusSuccess(resetStatus, nextProps.resetStatus)) {
      getLearningHistory();
      getNextQuestion(true);
    }
  }

  _handleScreenWillFocus = () => {
    this.props.getLearningHistory();
    this.props.getNextQuestion(true);
  }

  _handleResetLearningHistoryPress = () => {
    this.setState({
      modalDisplay: true,
    });
  }

  _handlePlayPress = () => {
    this.props.setExcludeUnanswered(false);
    this.props.navigation.navigate('Play');
  }

  _handleRePlayPress = () => {
    this.props.setExcludeUnanswered(true);
    this.props.navigation.navigate('Play');
  }

  _handleConfirmOK = () => {
    this.props.resetLearningHistory();
    this.setState({
      modalDisplay: false,
    });
  }

  _handleConfirmCancel = () => {
    this.setState({
      modalDisplay: false,
    });
  }

  _renderPlayBtn = () => {
    const { nextQuestionStatus, playQuestion } = this.props;
    const { total } = this.props.history;

    if (isStatusLoading(nextQuestionStatus)) {
      return (
        <View style={styles.topContainer}>
          <ActivityIndicator />
        </View>
      );
    }
    if (playQuestion) {
      return (
        <Button
          onPress={this._handlePlayPress}
          style={[styles.topContainer, styles.btnPlay]}
          disabled={total === 0}
        >
          <Text style={styles.btnPlayTitle}>{QUIZ_LANG.LEARN}</Text>
        </Button>
      );
    } else {
      return (
        <View style={[styles.topContainer, { flex: 100 }]}>
          <Entypo name="price-ribbon" size={100} color={COLOR.GOVERNOR_BAY} />
          <Text style={styles.msgText}>{QUIZ_LANG.NO_QUESTION}</Text>
        </View>
      );
    }
  }

  render() {
    const { historyStatus, resetStatus } = this.props;
    const { correct, incorrect, total, wrong_questions } = this.props.history;
    const answered = correct + incorrect;
    const progress = total === 0 ? 0 : correct === total ? 100 : (correct / total * 100).toFixed(0);
    return (
      <View style={styles.container}>
        <NavigationEvents onWillFocus={this._handleScreenWillFocus} />
        <NavBar
          navigation={this.props.navigation}
          title={QUIZ_LANG.TITLE}
        />
        {this._renderPlayBtn()}
        {wrong_questions.length !== 0 && this.props.playQuestion ?
          <View style={styles.recentIncorrectWrapper}>
            <View style={{ flexDirection: 'row' }}>
              <Button
                onPress={this._handleRePlayPress}
                style={styles.btnReplay}
              >
                <Text style={styles.btnReplayTitle}>{QUIZ_LANG.FAIL_QUESTION}</Text>
                <EvilIcons style={styles.replayIcon} name="clock" size={30} color={COLOR.WHITE} />
              </Button>
              <View style={{ flex: 1 }}></View>
            </View>
            <RecentIncorrect
              status={historyStatus}
              list={wrong_questions}
            />
          </View>
          :
          null
        }
        <View style={{ flex: 1 }}></View>
        <View style={styles.stat}>
          <View style={styles.statSummary}>
            <Text style={[styles.statSummaryText, styles.statTextLarge]}>{progress}</Text>
            <Text style={[styles.statSummaryText, styles.statTextSmall]}> %</Text>
          </View>
          <View style={styles.statDetail}>
            <View style={styles.statRow}>
              <Text style={styles.statText}>{QUIZ_LANG.TOTAL_ANSWER}: {answered}</Text>
              <Text style={styles.statText}>{QUIZ_LANG.TOTAL_QUESTION}: {total}</Text>
            </View>
            <View style={[styles.statRow, styles.statBar]}>
              {answered !== 0 && <View style={[styles.progressBar, styles.progressBarBlue, { flex: answered }, (total - answered) !== 0 && styles.noRightRadius]}></View>}
              {total - answered !== 0 && <View style={[styles.progressBar, styles.progressBarWhite, { flex: (total - answered) }, answered !== 0 && styles.noLeftRadius]}></View>}
              {(answered === 0 && total === 0) && <View style={[styles.progressBar, styles.progressBarWhite, { flex: 1 }]}></View>}
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statText}>{QUIZ_LANG.TOTAL_CORRECT}: {correct}</Text>
              <Text style={styles.statText}>{QUIZ_LANG.TOTAL_INCORRECT}: {incorrect}</Text>
            </View>
            <View style={[styles.statRow, styles.statBar]}>
              {correct !== 0 && <View style={[styles.progressBar, styles.progressBarGreen, { flex: correct }, incorrect !== 0 && styles.noRightRadius]}></View>}
              {incorrect !== 0 && <View style={[styles.progressBar, styles.progressBarRed, { flex: incorrect }, correct !== 0 && styles.noLeftRadius]}></View>}
              {(correct === 0 && incorrect === 0) && <View style={[styles.progressBar, styles.progressBarWhite, { flex: 1 }]}></View>}
            </View>
          </View>
        </View>
        <Button
          style={styles.resetBtn}
          onPress={this._handleResetLearningHistoryPress}
          status={resetStatus}
        >
          <Text style={styles.resetBtnText}>{QUIZ_LANG.RESET_HISTORY}</Text>
          <View style={[styles.resetBtnIcon]}>
            {isStatusLoading(resetStatus) ?
              <ActivityIndicator />
              :
              <MaterialIcons style={{ backgroundColor: 'transparent' }} name="refresh" color={COLOR.WHITE} size={30}/>
            }
          </View>
        </Button>
        <ConfirmModal
          isDisplay={this.state.modalDisplay}
          handleOK={this._handleConfirmOK}
          handleCancel={this._handleConfirmCancel}
          message={QUIZ_LANG.CONFIRM_RESET_MESSAGE}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Quiz);
