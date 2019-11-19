import AC from '../constants';

const initialState = false;

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case AC.SET_EXCLUDE_UNANSWERED:
      return payload;
    default:
      return state;
  }
};
