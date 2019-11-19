import moment from 'moment';

import ActionGenerator from '../utils/action-generator';
import { NormalActions, RequestActions } from './actions';
import getScreenIcon from './screen-icon';

const actionGenerator = new ActionGenerator(NormalActions, RequestActions)
export const initialStatus = actionGenerator.getInitialStatus();
export default actionGenerator.getActionNames();

export { getScreenIcon };

export const STATUS_READY = 'STATUS_READY';
export const STATUS_LOADING = 'STATUS_LOADING';
export const STATUS_SUCCESS = 'STATUS_SUCCESS';
export const STATUS_ERROR = 'STATUS_ERROR';

export const UI_CONST = {
  NAV_BAR_HEIGHT: 60,
};

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DEFAULT_BIRTHDAY = moment().add(-20, 'years').toDate();
export const MIN_BIRTHDAY = moment().add(-150, 'years').toDate();
export const MAX_BIRTHDAY = moment().add(-5, 'years').toDate();

export const APP_CONST = {
  TYPE_IMAGE_ANSWER: 'image_answer',
  TYPE_TEXT_ANSWER: 'text_answer',
  DEFAULT_FONT: 'meiryo',
}

export const COLOR = {
  WHITE: '#FFFFFF',
  VIOLET: '#B248CE',
  TAMARILLO: '#90100F',
  LIGHT_RED: '#FE5A51',
  CINNABAR: '#E23A31',
  BITTER_SWEET: '#FF6861',
  BLUE: '#4354C0',
  POLO_BULE: '#8C99CE',
  GOVERNOR_BAY: '#3A4AC4',
  LIGHT_GREEN: '#41FFB9',
  GALLERY: '#EFEFEF',
  LIGHT_GRAY: '#DFD9F3',
  DUSTY_GRAY: '#9A9A9A',
  WILD_SAND: '#F4F4F4',
  MERCURY: '#E6E6E6',
  BLACK: '#292D30',
  LAVENDER_GRAY: '#C8C1DE',
  GREEN: '#00FF00',
}

export const SOCIAL_COLOR = {
  FACEBOOK: '#3B5998',
  INSTAGRAM: '#3F729B',
  TWITTER: '#00ACEE',
  YAHOO: '#720E9E',
}

export const COMMON_LANG = {
  YES: 'はい',
  NO: 'いいえ',
  DONE: '決定',
  CANCEL: '戻る',
  CLEAR: 'Clear',
  SET: 'Set',
  INVALID_EMAIL: 'Input have be a valid email!',
  INVALID_NAME: 'Name cannot empty',
  INVALID_PASSWORD: 'Password must contain atleast 8 charracters, 1 lower case, 1 upper case',
  INVALID_PASSWORD_CONFIRM: 'Password confirm have to match with password!',
  SUBMIT: 'SUBMIT',
  TAGS: 'Tags',
  CATEGORIES: 'Categories',
}

export const ERROR_LANG = {
  NETWORK_CONNECTION_ERROR: 'ネットワークに接続されてません。\nネットワーク接続を確認後、再試行してください。',
  INTERNAL_ERROR: '内部エラーが発生しました。\n最初からやり直してください。',
  TRY: '再実行',
};

export const HOME_LANG = {
  TITLE: 'Home',
  PLAY: '学習',
  MANAGER: '管理',
}

export const LIST_QUESTION_LANG = {
  TITLE: '管理',
  NORMAL_MODE: 'キャンセル',
  CONFIRM_DELETE: '選択した画像を削除する',
}

export const QUESTION_LANG = {
  TITLE: '新規に問題を設定する',
  EDIT_MODE_TITLE: '問題を修正する',
  DEFAULT_QUESTION_INPUT: 'これは何ですか？',
  QUESTION_TEXT_PLACEHOLDER: '問題文入力',
  ANSWER_TEXT_PLACEHOLDER: '解答入力',
  DIFFICULTY: '難易度: ',
  MASK: 'マスク付け',
  MASK_TITLE: 'マスキング',
  CREATE_ANSWER: '解答を作成する',
  EDIT_ANSWER: '解答を修正する',
  ANSWER: '解答',
}

export const QUIZ_LANG = {
  TITLE: 'マイページ',
  LEARN: '続きを学習する',
  NO_QUESTION: 'もう質問はありません',
  FAIL_QUESTION: '最近間違えた質問',
  RECALL_RATIO: '達成率',
  TOTAL_ANSWER: '回答数',
  TOTAL_QUESTION: '全問題数',
  TOTAL_CORRECT: '正解',
  TOTAL_INCORRECT: '不正解',
  RESET_HISTORY: '学習履歴をリセットする',
  CONFIRM_RESET_MESSAGE: '学習履歴をリセットしますか？',
}

export const PLAY_LANG = {
  TITLE: '学習',
  KNOW: 'わかる',
  UNKNOW: 'わからない',
  ANSWER_HINT: '正解は',
  KNOW_RIGHT: 'あっていた',
  KNOW_WRONG: '間違っていた',
  NEXT: '次の問題に進みます',
}

export const LIST_CALENDAR_LANG = {
  TITLE: 'List Calendar',
  REQUIRE_PREMISSION: 'Require CALENDAR Permission.'
}

export const CALENDAR_LANG = {
  TITLE: 'Gakushu Calendar',
  NAME: 'Gakushu Calendar',
  EVENT_TITLE: 'Learning time!!!',
  COLOR: COLOR.LIGHT_GREEN,
  DOW_SHORTS: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
  DOW_LABELS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  DOW_SYMBOLS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  DATE: 'Date',
  REPEAT: 'Repeat',
}

export const CATEGORY_LANG = {
  TITLE: 'Category',
  ADD_INPUT_PLACEHOLDER: 'Type to add category',
  CONFIRM_DELETE_MESSAGE: 'Are you want to delete this category?',
  ALL_QUESTION: 'All Question',
}

export const TAG_LANG = {
  TITLE: 'Tag',
  ADD_INPUT_PLACEHOLDER: 'Type to add tag',
  CONFIRM_DELETE_MESSAGE: 'Are you want to delete this tag?',
  ALL_QUESTION: 'All Question',
}

export const PROFILE_LANG = {
  TITLE: 'Profile',
  VERIFY_EMAIL_MESSAGE: 'Your email was not verified, press the button below to send verification to your email',
  SEND_VERIFY_EMAIL: 'Send verification link via email',
  UPDATE: 'UPDATE',
  CHANGE_PASSWORD: 'CHANGE PASSWORD',
  LOGOUT: 'LOGOUT',
  SUCCESS_MESSAGE: 'Update profile success',
}

export const CHANGE_PASSWORD_LANG = {
  TITLE: 'Change password',
  CURRENT_PASSWORD_PLACEHOLDER: 'Current Password',
  NEW_PASSWORD_PLACEHOLDER: 'New Password',
  NEW_PASSWORD_CONFIRM_PLACEHOLDER: 'New Password Confirm',
  SUCCESS_MESSAGE: 'Change password success!',
}

export const LANDING_LANG = {
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER',
}

export const LOGIN_LANG = {
  INVALID_EMAIL: 'Email is empty',
  INVALID_PASSWORD: 'Password is empty',
  LOGIN_WITH_FACEBOOK: 'Login with Facebook',
  LOGIN_WITH_INSTAGRAM: 'Login with Instagram',
  LOGIN_WITH_TWITTER: 'Login with Twitter',
  LOGIN_WITH_YAHOO: 'Login with YahooJP',
  OR: 'or',
  DONT_HAVE_ACCOUNT: 'Don\'t have an account? ',
  REGISTER_NOW: 'Register Now',
}

export const REGISTER_LANG = {
  EMAIL_INPUT_PLACEHOLDER: 'Email',
  NAME_INPUT_PLACEHOLDER: 'Name',
  PASSWORD_INPUT_PLACEHOLDER: 'Password',
  PASSWORD_CONFIRM_INPUT_PLACEHOLDER: 'Password confirm',
  OR: 'or',
  REGISTER_WITH: 'Register with',
  HAVE_AN_ACCOUNT: 'Have an account?',
  LOGIN: 'Login',
  SUCCESS_MESSAGE: 'Register success!',
}

export const RESET_PASSWORD_LANG = {
  TITLE: 'FORGOT PASSWORD?',
  GUILD: 'We just need your registed email to send you password reset instruction.',
  EMAIL_INPUT_PLACEHOLDER: 'Email',
  INVALID_EMAIL: 'Input have be a valid email!',
  DONT_HAVE_ACCOUNT: 'Don\'t have an account? ',
  REGISTER_NOW: 'Register Now',
  SUCCESS_MESSAGE: 'Reset password success!',
}
