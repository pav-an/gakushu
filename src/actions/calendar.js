import AC from '../constants';
import {
  CALENDAR_URL,
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
} from '../services/http-requests';

const _uploadCalendar = (data, token) => {
  if (data.id) {
    return httpPut(CALENDAR_URL + '/' + data.id, data, token)
  } else {
    return httpPost(CALENDAR_URL, data, token);
  }
};

export function listCalendar () {
  return (dispatch, getState) => {
    dispatch({ type: AC.LIST_CALENDAR_REQUEST });

    return httpGet(CALENDAR_URL, getState().token)
      .then(list => dispatch({ type: AC.LIST_CALENDAR_SUCCESS, payload: list.reverse() }))
      .catch(err => dispatch({ type: AC.LIST_CALENDAR_ERROR, payload: err }));
  }
}

export function uploadCalendar (input) {
  return (dispatch, getState) => {
    dispatch({ type: AC.UPLOAD_CALENDAR_REQUEST });
    return _uploadCalendar(input, getState().token)
      .then(calendar => {
        dispatch({ type: AC.ADD_CALENDAR_TO_LIST, payload: calendar });
        dispatch({ type: AC.UPLOAD_CALENDAR_SUCCESS });
      })
      .catch(err => dispatch({ type: AC.UPLOAD_CALENDAR_ERROR, payload: err }));
  }
}

export function removeCalendar (calendarId) {
  return (dispatch, getState) => {
    dispatch({ type: AC.REMOVE_CALENDAR_REQUEST });
    return httpDelete(CALENDAR_URL + '/' + calendarId, getState().token)
      .then(() => {
        dispatch({ type: AC.REMOVE_CALENDAR_FROM_LIST, payload: calendarId });
        dispatch({ type: AC.REMOVE_CALENDAR_SUCCESS });
      })
      .catch(err => dispatch({ type: AC.REMOVE_CALENDAR_ERROR, payload: err }));
  }
}
