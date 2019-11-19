import AC from '../constants';

const initialState = '';

const errorReducer = (state = initialState, action) => {
  const { type, payload } = action;
  if (type === AC.RESET_ERROR) {
    return '';
  }
  if (type.endsWith('_ERROR')) {
    return payload;
  }
  return state;
};

export default errorReducer;
