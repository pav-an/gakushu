import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { Dimensions } from 'react-native';

import { UI_CONST, COLOR } from '../../constants';

const DIFFICULTY_HEIGHT = 50;
export const WINDOW_HEIGHT = Dimensions.get('window').height - Constants.statusBarHeight;
export const FULL_ANSWER_TOP = UI_CONST.NAV_BAR_HEIGHT + DIFFICULTY_HEIGHT;

export default StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 3,
    backgroundColor: COLOR.BLACK,
    opacity: 0.5,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
  },
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  btnNavbar: {
    height: UI_CONST.NAV_BAR_HEIGHT,
    width: UI_CONST.NAV_BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDoneNavbarText: {
    fontSize: 18,
    color: COLOR.BLUE,
  },
  badge: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 12,
    height: 12,
    top: 6,
    right: 6,
    borderRadius: 6,
    backgroundColor: COLOR.TAMARILLO,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLOR.WHITE, 
  },
  absoluteContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLOR.WHITE,
  },
  topContainer: {
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
  },
  oneLineInputContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  bottomContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  btn: {
    flex: 1,
    paddingTop: 30,
    alignItems: 'center',
    backgroundColor: COLOR.GOVERNOR_BAY,
  },
  separator: {
    width: 3,
    backgroundColor: COLOR.WHITE,
  },
  textInput: {
    flex: 1,
    padding: 15,
    backgroundColor: COLOR.WHITE,
    fontSize: 18,
    textAlignVertical: 'top',
    justifyContent: 'flex-start',
  },
  oneLineTextInput: {
    flex: 1,
    paddingLeft: 15,
    backgroundColor: COLOR.WHITE,
    fontSize: 18,
  },
  btnDone: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -40,
    height: 40,
    alignItems: 'center',
    backgroundColor: COLOR.GOVERNOR_BAY,
  },
  textBtnDone: {
    fontSize: 18,
    color: COLOR.WHITE,
  },
  btnAddAnswer: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.GOVERNOR_BAY,
    marginTop: 3,
  },
  textBtnAddAnswer: {
    fontSize: 18,
    color: COLOR.LIGHT_GRAY,
  },
  imageZoom: {
    borderTopColor: COLOR.GOVERNOR_BAY,
    borderTopWidth: 1,
    borderBottomColor: COLOR.GOVERNOR_BAY,
    borderBottomWidth: 1,
  },
  toolContainer: {
    marginTop: 20,
    flexDirection: 'row',
  },
  maskContainer: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnMiniContainer: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnMini: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: COLOR.GOVERNOR_BAY,
  },
  btnMask: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    borderRadius: 15,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: COLOR.GOVERNOR_BAY,
  },
  textMask: {
    fontSize: 18,
    marginLeft: 10,
    color: COLOR.LIGHT_GRAY,
  },
  btnOnImage: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.GOVERNOR_BAY,
  },
  answerContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    backgroundColor: COLOR.GOVERNOR_BAY,
  },
  diffContainer: {
    height: 50,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.GOVERNOR_BAY,
  },
  diffTextDescript: {
    fontSize: 15,
    color: COLOR.LIGHT_GRAY,
  },
  diffTextValue: {
    fontSize: 15,
    color: COLOR.WHITE,
    marginRight: 10,
  },
  answerWrapper: {
    flex: 1,
  },
  topAnswerContainer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLOR.WHITE,
    borderBottomWidth: 3,
    borderBottomColor: COLOR.WHITE,
  },
  textInputAnswer: {
    flex: 1,
    padding: 5,
    color: COLOR.LIGHT_GRAY,
    fontSize: 18,
    justifyContent: 'flex-start',
  },
  bottomAnswerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
});
