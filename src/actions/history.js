import AC from '../constants';
import { 
  PLAY_HISTORY_URL,
  PLAY_RESET_URL,
  httpGet,
  httpPost,
} from '../services/http-requests';

export function getLearningHistory () {
  return (dispatch, getState) => {
    dispatch({ type: AC.GET_LEARNING_HISTORY_REQUEST });

    return httpGet(PLAY_HISTORY_URL, getState().token)
      .then(history => dispatch({ type: AC.GET_LEARNING_HISTORY_SUCCESS, payload: history }))
      .catch(err => dispatch({ type: AC.GET_LEARNING_HISTORY_ERROR, payload: err }));
  }
}

export function resetLearningHistory () {
  return (dispatch, getState) => {
    dispatch({ type: AC.RESET_LEARNING_HISTORY_REQUEST });

    return httpPost(PLAY_RESET_URL, {}, getState().token)
      .then(() => dispatch({ type: AC.RESET_LEARNING_HISTORY_SUCCESS }))
      .catch(err => dispatch({ type: AC.RESET_LEARNING_HISTORY_ERROR, payload: err }));
  }
}

export function setExcludeUnanswered (exclude) {
  return { type: AC.SET_EXCLUDE_UNANSWERED, payload: exclude };
}
