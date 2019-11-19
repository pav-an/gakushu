import AC from '../constants';
import {
  PLAY_NEXT_QUESTION_URL,
  PLAY_SAVE_ANSWER_URL,
  httpPost,
  httpGet,
} from '../services/http-requests';

export function getNextQuestion (isCheck) {
  return (dispatch, getState) => {
    dispatch({ type: AC.GET_NEXT_QUESTION_REQUEST });

    const exclude = isCheck ? '' : '?exclude_unanswered=' + getState().excludeUnanswered;
    return httpGet(PLAY_NEXT_QUESTION_URL + exclude, getState().token)
      .then(res => dispatch({ type: AC.GET_NEXT_QUESTION_SUCCESS, payload: res.question }))
      .catch(err => dispatch({ type: AC.GET_NEXT_QUESTION_ERROR, payload: err }));
  }
}

export function saveAnswer (answer) {
  return (dispatch, getState) => {
    dispatch({ type: AC.SAVE_ANSWER_REQUEST });

    return httpPost(PLAY_SAVE_ANSWER_URL, answer, getState().token)
      .then(() => dispatch({ type: AC.SAVE_ANSWER_SUCCESS }))
      .catch(err => dispatch({ type: AC.SAVE_ANSWER_ERROR, payload: err }));
  }
}

export function resetQuizQuestion () {
  return { type: AC.RESET_PLAY_QUESTION };
}
