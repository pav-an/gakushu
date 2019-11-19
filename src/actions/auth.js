import moment from 'moment';

import AC, { DATE_FORMAT } from '../constants';
import { LOGIN_URL, REGISTER_URL, RESET_PASSWORD_URL, httpPost } from '../services/http-requests';
import { getLocalToken as getToken, saveLocalToken } from '../utils/local-token';

export function login(email, password) {
  return dispatch => {
    dispatch({ type: AC.LOGIN_REQUEST });
    return httpPost(LOGIN_URL, { email, password })
      .then(tokenInfo => {
        const { token } = tokenInfo;
        saveLocalToken(token);
        dispatch({ type: AC.LOGIN_SUCCESS, payload: token });
      })
      .catch(err => dispatch({ type: AC.LOGIN_ERROR, payload: err }));
  }
}

export function loginSocial(token) {
  return dispatch => {
    dispatch({ type: AC.LOGIN_REQUEST });
    return saveLocalToken(token)
      .then(() => dispatch({ type: AC.LOGIN_SUCCESS, payload: token }))
      .catch(err => dispatch({ type: AC.LOGIN_ERROR, payload: err }));
  }
}

export function logout() {
  return dispatch => {
    dispatch({ type: AC.LOGOUT_REQUEST });
    return saveLocalToken('')
      .then(() => dispatch({ type: AC.LOGOUT_SUCCESS }))
      .catch(err => dispatch({ type: AC.LOGOUT_ERROR, payload: err }));
  }
}

export function register({ email, name, birthday, password }) {
  return dispatch => {
    dispatch({ type: AC.REGISTER_REQUEST });
    const data = {
      email,
      name,
      birthday: moment(birthday).format(DATE_FORMAT),
      password,
    };
    return httpPost(REGISTER_URL, data)
      .then(() => dispatch({ type: AC.REGISTER_SUCCESS }))
      .catch(err => dispatch({ type: AC.REGISTER_ERROR, payload: err }));
  }
}

export function resetPassword(email) {
  return dispatch => {
    dispatch({ type: AC.RESET_PASSWORD_REQUEST });
    return httpPost(RESET_PASSWORD_URL, { email })
      .then(() => dispatch({ type: AC.RESET_PASSWORD_SUCCESS }))
      .catch(err => dispatch({ type: AC.RESET_PASSWORD_ERROR, payload: err }));
  }
}

export function getLocalToken() {
  return dispatch => {
    dispatch({ type: AC.GET_LOCAL_TOKEN_REQUEST });
    return getToken()
      .then(token => {
        if (token) {
          dispatch({ type: AC.GET_LOCAL_TOKEN_SUCCESS, payload: token });
        } else {
          dispatch({ type: AC.GET_LOCAL_TOKEN_ERROR, payload: '' });
        }
      })
  }
}
