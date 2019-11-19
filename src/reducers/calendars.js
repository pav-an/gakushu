import AC from '../constants';

const initialState = [];

function next(state, action) {
  const { type, payload } = action;

  switch (type) {
    case AC.ADD_CALENDAR_TO_LIST:
      return [
        payload,
        ...state,
      ];
    case AC.REMOVE_CALENDAR_FROM_LIST:
      return state.filter(c => payload !== c.id);
    default:
      return state;
  }
}

export default {
  requestName: AC.LIST_CALENDAR,
  initialState,
  next,
}
