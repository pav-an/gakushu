import combineReducers from '../utils/combine-reducers';

import calendars from './calendars';
import categories from './categories';
import error from './error';
import excludeUnanswered from './exclude-unanswered';
import history from './history';
import playQuestion from './play-question';
import profile from './profile';
import questions from './questions';
import status from './status';
import tags from './tags';
import token from './token';

const rootReducer = {
  calendars,
  categories,
  error,
  excludeUnanswered,
  history,
  playQuestion,
  profile,
  questions,
  status,
  tags,
  token,
}

export default combineReducers(rootReducer);

