import AC from '../constants';

const initialState = [];

function next(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case AC.ADD_TAG_TO_LIST:
      return [
        payload,
        ...state,
      ];
    case AC.REMOVE_TAG_FROM_LIST:
      return state.filter(q => payload.indexOf(q.id) === -1);
    case AC.EDIT_TAG_IN_LIST:
      var index = state.findIndex(q => q.id === payload.id);
      return [
        ...state.slice(0, index),
        payload,
        ...state.slice(index + 1),
      ]
    default:
      return state;
  }
}

export default {
  requestName: AC.LIST_TAG,
  initialState,
  next,
}
