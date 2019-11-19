import AC from '../constants';

const initialState = {
  total: 0,
  correct: 0,
  incorrect: 0,
  wrong_questions: [],
};

export default {
  requestName: AC.GET_LEARNING_HISTORY,
  initialState,
};
