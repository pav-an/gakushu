import AC from '../constants';
import {
  CATEGORY_URL,
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
} from '../services/http-requests';

const _uploadCategory = (data, token) => {
  if (data.id) {
    return httpPut(CATEGORY_URL + '/' + data.id, data, token)
  } else {
    return httpPost(CATEGORY_URL, data, token);
  }
};

export function listCategory () {
  return (dispatch, getState) => {
    dispatch({ type: AC.LIST_CATEGORY_REQUEST });

    return httpGet(CATEGORY_URL, getState().token)
      .then(list => dispatch({ type: AC.LIST_CATEGORY_SUCCESS, payload: list.reverse() }))
      .catch(err => dispatch({ type: AC.LIST_CATEGORY_ERROR, payload: err }));
  }
}

export function uploadCategory (input) {
  return (dispatch, getState) => {
    dispatch({ type: AC.UPLOAD_CATEGORY_REQUEST });
    return _uploadCategory(input, getState().token)
      .then(category => {
        if (input.id) {
          dispatch({ type: AC.EDIT_CATEGORY_IN_LIST, payload: category });
        } else {
          dispatch({ type: AC.ADD_CATEGORY_TO_LIST, payload: category });
        }
        dispatch({ type: AC.UPLOAD_CATEGORY_SUCCESS });
      })
      .catch(err => dispatch({ type: AC.UPLOAD_CATEGORY_ERROR, payload: err }));
  }
}

export function removeCategory (categoryId) {
  return (dispatch, getState) => {
    dispatch({ type: AC.REMOVE_CATEGORY_REQUEST });
    return httpDelete(CATEGORY_URL + '/' + categoryId, getState().token)
      .then(() => {
        dispatch({ type: AC.REMOVE_CATEGORY_FROM_LIST, payload: categoryId });
        dispatch({ type: AC.REMOVE_CATEGORY_SUCCESS });
      })
      .catch(err => dispatch({ type: AC.REMOVE_CATEGORY_ERROR, payload: err }));
  }
}
