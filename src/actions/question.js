import AC from '../constants';
import { APP_CONST, QUESTION_LANG } from '../constants';
import {
  QUESTION_URL,
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
} from '../services/http-requests';
import { uploadImage } from './image';

function _uploadPost (data, token) {
  if (data.id) {
    return httpPut(QUESTION_URL + '/' + data.id, data, token)
  } else {
    return httpPost(QUESTION_URL, data, token);
  }
}

export function listQuestion (params) {
  return (dispatch, getState) => {
    dispatch({ type: AC.LIST_QUESTION_REQUEST });

    const getParams = params ? {
      tag_ids: params.tagIds,
      category_ids: params.categoryIds,
    } : null;
    return httpGet(QUESTION_URL, getState().token, getParams)
      .then(list => dispatch({ type: AC.LIST_QUESTION_SUCCESS, payload: list.reverse() }))
      .catch(err => dispatch({ type: AC.LIST_QUESTION_ERROR, payload: err }));
  }
}

export function uploadQuestion (input) {
  return (dispatch, getState) => {
    dispatch({ type: AC.UPLOAD_QUESTION_REQUEST });
    const token = getState().token;
    return Promise.all([
      uploadImage(input.rawQuestionUri, token),
      uploadImage(input.questionUri, token),
      uploadImage(input.answerUri, token),
    ])
      .then(result => {
        const data = {
          question_raw_image_url: result[ 0 ].link,
          question_image_url: result[ 1 ].link,
          answer: result[ 2 ].link || input.answerText,
          type: input.answerUri ? APP_CONST.TYPE_IMAGE_ANSWER : APP_CONST.TYPE_TEXT_ANSWER,
          difficulty: input.difficulty,
          question_text: input.questionText || QUESTION_LANG.DEFAULT_QUESTION_INPUT,
          tag_ids: input.tagIds.join(','),
          category_ids: input.categoryIds.join(','),
        };
        if (input.id) {
          data.id = input.id;
        }
        return _uploadPost(data, token);
      })
      .then(question => {
        if (input.id) {
          dispatch({ type: AC.EDIT_QUESTION_IN_LIST, payload: question });
        } else {
          dispatch({ type: AC.ADD_QUESTION_TO_LIST, payload: question });
        }
        dispatch({ type: AC.UPLOAD_QUESTION_SUCCESS });
      })
      .catch(err => dispatch({ type: AC.UPLOAD_QUESTION_ERROR, payload: err }));
  }
}

export function removeQuestions (questionIds) {
  return (dispatch, getState) => {
    dispatch({ type: AC.REMOVE_QUESTION_REQUEST });

    const token = getState().token;

    const promises = [];
    for (let i = 0; i < questionIds.length; i++) {
      promises.push(httpDelete(QUESTION_URL + '/' + questionIds[ i ], token));
    }
    return Promise.all(promises)
      .then(() => {
        dispatch({ type: AC.REMOVE_QUESTION_SUCCESS });
        dispatch({ type: AC.REMOVE_QUESTION_FROM_LIST, payload: questionIds });
      })
      .catch(err => dispatch({ type: AC.REMOVE_QUESTION_ERROR, payload: err }));
  }
}
