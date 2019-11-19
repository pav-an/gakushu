import config from '../config';

export const TEST_URL = '/test';
export const LOGIN_URL = '/auth/login';
export const REGISTER_URL = '/auth/register';
export const RESET_PASSWORD_URL = '/auth/resetPassword';
export const PROFILE_URL = '/api/v1/me';
export const RESEND_VERIFY_EMAIL_URL = '/api/v1/resendVerifyEmail';
export const QUESTION_URL = '/api/v1/question';
export const CALENDAR_URL = '/api/v1/calendar';
export const IMAGE_URL = '/api/v1/image';
export const PLAY_NEXT_QUESTION_URL = '/api/v1/play/next_question';
export const PLAY_SAVE_ANSWER_URL = '/api/v1/play/save_answer';
export const PLAY_RESET_URL = '/api/v1/play/reset';
export const PLAY_HISTORY_URL = '/api/v1/play/history';
export const CATEGORY_URL = '/api/v1/category';
export const TAG_URL = '/api/v1/tag';

const _fetchTimeout = (url, options) => {
  let didTimeOut = false;
  return new Promise(function(resolve, reject) {
    const timeout = setTimeout(function() {
      didTimeOut = true;
      reject('timeout');
    }, config.TIMEOUT);

    fetch(url, options)
      .then(function(response) {
        clearTimeout(timeout);
        if(!didTimeOut) {
          resolve(response);
        }
      })
      .catch(function(err) {
        // Rejection already happened with setTimeout
        if(didTimeOut) return;
        // Reject with error
        reject(err);
      });
  });
}

const _http = ({ url, method, headers, data, token, isFormData }) => {
  // eslint-disable-next-line
  console.info(url, data || '');
  headers = headers || {};
  headers[ 'pragma' ] = 'no-cache';
  headers[ 'cache-control' ] = 'no-cache';

  if (token) {
    headers.Authorization = 'Bearer ' + token;
  }
  const options = {
    method,
    headers,
  };
  if (data) {
    if (isFormData) {
      options.body = data;
    } else {
      options.body = JSON.stringify(data);
    }
  }

  return _fetchTimeout(config.API_URL + url, options)
    .then(res => res.json())
    .then(data => {
      // eslint-disable-next-line
      console.info(url, 'response: ', data);
      if (data.error) {
        return Promise.reject(data.error);
      }
      return data;
    })
    .catch(err => {
      if (err instanceof TypeError || err === 'timeout') {
        return Promise.reject('No Connection');
      }
      return Promise.reject(err);
    });
}

export const httpGet = (url, token, params) => {
  let query = '';
  if (params) {
    query = Object.keys(params).map((key, i) => {
      const value = params[ key ];
      return `${i === 0 ? '?' : '&'}${key}=${value}`;
    }).join('');
  }
  return _http({
    url: url + query,
    method: 'GET',
    token,
  });
};

export const httpPost = (url, data, token) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  return _http({
    url,
    method: 'POST',
    headers,
    data,
    token,
  });
};

export const httpDelete = (url, token) => {
  return _http({
    url,
    method: 'DELETE',
    token,
  });
};

export const httpPostFormData = (url, formData, token) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
  };
  return _http({
    url,
    method: 'POST',
    headers,
    data: formData,
    token,
    isFormData: true,
  });
};

export const httpPut = (url, data, token) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  return _http({
    url,
    method: 'PUT',
    headers,
    data,
    token,
  });
};
