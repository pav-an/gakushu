import moment from 'moment';

import AC, { DATE_FORMAT } from '../constants';
import { PROFILE_URL, RESEND_VERIFY_EMAIL_URL, httpGet, httpPost, httpPut } from '../services/http-requests';
import { uploadImage } from './image';

export function getProfile () {
  return (dispatch, getState) => {
    dispatch({ type: AC.GET_PROFILE_REQUEST });

    return httpGet(PROFILE_URL, getState().token)
      .then(info => dispatch({ type: AC.GET_PROFILE_SUCCESS, payload: info }))
      .catch(err => dispatch({ type: AC.GET_PROFILE_ERROR, payload: err }));
  }
}

export function uploadProfile ({ name, birthday, avatarUri }) {
  return (dispatch, getState) => {
    dispatch({ type: AC.UPLOAD_PROFILE_REQUEST });

    const token = getState().token;
    return uploadImage(avatarUri, token)
      .then(result => {
        const data = {
          name,
          birthday: moment(birthday).format(DATE_FORMAT),
          avatar_url: result.link,
        };
        return httpPut(PROFILE_URL, data, token);
      })
      .then(data => dispatch({ type: AC.UPLOAD_PROFILE_SUCCESS, payload: data }))
      .catch(err => dispatch({ type: AC.UPLOAD_PROFILE_ERROR, payload: err }));
  }
}

export function changePassword ({ currentPassword, newPassword }) {
  return (dispatch, getState) => {
    dispatch({ type: AC.CHANGE_PASSWORD_REQUEST });

    const data = {
      current_password: currentPassword,
      password: newPassword,
    };
    return httpPut(PROFILE_URL, data, getState().token)
      .then(data => dispatch({ type: AC.CHANGE_PASSWORD_SUCCESS, payload: data }))
      .catch(err => dispatch({ type: AC.CHANGE_PASSWORD_ERROR, payload: err }));
  }
}

export function resendVerifyEmail () {
  return (dispatch, getState) => {
    dispatch({ type: AC.RESEND_VERIFY_EMAIL_REQUEST });

    return httpPost(RESEND_VERIFY_EMAIL_URL, {}, getState().token)
      .then(() => dispatch({ type: AC.RESEND_VERIFY_EMAIL_SUCCESS }))
      .catch(err => dispatch({ type: AC.RESEND_VERIFY_EMAIL_ERROR, payload: err }));
  }
}
