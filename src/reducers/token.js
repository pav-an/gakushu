import AC from '../constants';

const initialState = '';

function next(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case AC.GET_LOCAL_TOKEN_SUCCESS:
      return payload;
    case AC.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
}

export default {
  requestName: AC.LOGIN,
  initialState,
  next,
};
