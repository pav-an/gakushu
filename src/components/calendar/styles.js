import { StyleSheet, Platform } from 'react-native';
import { UI_CONST, COLOR } from '../../constants';

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  saveBtn: {
    height: UI_CONST.NAV_BAR_HEIGHT,
    width: UI_CONST.NAV_BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderBottomColor: COLOR.DUSTY_GRAY,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  textStatusBar: {
    flex: 1,
    marginLeft: 10,
    color: COLOR.GOVERNOR_BAY,
    fontSize: 18,
    fontWeight: 'bold',
  },
  btnStatusBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBtnStatusBar: {
    fontSize: 18,
  },

  datePickerContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  fillDatePicker: {
    flex: 1,
    width: '100%',
  },
  wixCalendar: {
    height: 300,
    borderColor: COLOR.GOVERNOR_BAY,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  datePicker: {
    backgroundColor: COLOR.WHITE,
  },
  btnDatePickerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 75,
    borderWidth: 1,
    borderColor: COLOR.GOVERNOR_BAY,
  },
  btnDatePicker: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    margin: 10,
    borderRadius: 50,
    backgroundColor: COLOR.GOVERNOR_BAY,
  },
  textBtnDatePicker: {
    color: COLOR.WHITE,
    fontSize: 18,
  },
  btnWhite: {
    borderWidth: 3,
    borderColor: COLOR.GOVERNOR_BAY,
    backgroundColor: COLOR.WHITE,
  },
  textBtnWhite: {
    color: COLOR.GOVERNOR_BAY,
  },

  repeatContainer: {
    paddingVertical: 5,
    borderBottomColor: COLOR.DUSTY_GRAY,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  textRepeat: {
    marginLeft: 10,
    fontSize: 18,
  },
  dowBtnsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnDOW: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 35,
    margin: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 100,
  },
  textBtnDOW: {
    color: COLOR.DUSTY_GRAY,
  },

  hourMinPickerContainer: {
    height: 250,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: COLOR.DUSTY_GRAY,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  hourPickerWrapper: {
    flex: 1,
  },
  hourPicker: {
    height: Platform.OS === 'android' ? 50 : 'auto',
    width: 100,
  },
});
