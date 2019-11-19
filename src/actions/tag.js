import AC from '../constants';
import {
  TAG_URL,
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
} from '../services/http-requests';

const _uploadTag = (data, token) => {
  if (data.id) {
    return httpPut(TAG_URL + '/' + data.id, data, token)
  } else {
    return httpPost(TAG_URL, data, token);
  }
};

export function listTag () {
  return (dispatch, getState) => {
    dispatch({ type: AC.LIST_TAG_REQUEST });

    return httpGet(TAG_URL, getState().token)
      .then(list => dispatch({ type: AC.LIST_TAG_SUCCESS, payload: list.reverse() }))
      .catch(err => dispatch({ type: AC.LIST_TAG_ERROR, payload: err }));
  }
}

export function uploadTag (input) {
  return (dispatch, getState) => {
    dispatch({ type: AC.UPLOAD_TAG_REQUEST });
    return _uploadTag(input, getState().token)
      .then(tag => {
        if (input.id) {
          dispatch({ type: AC.EDIT_TAG_IN_LIST, payload: tag });
        } else {
          dispatch({ type: AC.ADD_TAG_TO_LIST, payload: tag });
        }
        dispatch({ type: AC.UPLOAD_TAG_SUCCESS });
      })
      .catch(err => dispatch({ type: AC.UPLOAD_TAG_ERROR, payload: err }));
  }
}

export function removeTag (tagId) {
  return (dispatch, getState) => {
    dispatch({ type: AC.REMOVE_TAG_REQUEST });
    return httpDelete(TAG_URL + '/' + tagId, getState().token)
      .then(() => {
        dispatch({ type: AC.REMOVE_TAG_FROM_LIST, payload: tagId });
        dispatch({ type: AC.REMOVE_TAG_SUCCESS });
      })
      .catch(err => dispatch({ type: AC.REMOVE_TAG_ERROR, payload: err }));
  }
}
