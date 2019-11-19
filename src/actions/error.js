import AC from '../constants';
import { TEST_URL, httpGet } from '../services/http-requests';

export function resetError() {
  return { type: AC.RESET_ERROR };
}

export function test() {
  return dispatch => {
    dispatch({ type: AC.TEST_REQUEST });
    return httpGet(TEST_URL, {})
      .then(() => dispatch({ type: AC.TEST_SUCCESS }))
      .catch(err => dispatch({ type: AC.TEST_ERROR, payload: err }));
  }
}
