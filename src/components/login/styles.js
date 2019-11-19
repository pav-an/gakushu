import { StyleSheet } from 'react-native';
import { COLOR } from '../../constants';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  whiteColor: {
    color: 'white',
  },
  topContainer: {
    justifyContent: 'center',
    margin: 10,
    padding: 10,
    borderRadius: 15,
    backgroundColor: COLOR.GOVERNOR_BAY,
  },
  title: {
    fontSize: 25,
    color: COLOR.WHITE,
  },
  inputEmail: {
    marginTop: 10,
    borderRadius: 25,
    backgroundColor: COLOR.WHITE,
  },
  inputPassword: {
    marginTop: 10,
    paddingRight: 10,
    borderRadius: 25,
    backgroundColor: COLOR.WHITE,
  },
  textMsg: {
    color: COLOR.TAMARILLO,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  btnLogin: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 10,
    backgroundColor: COLOR.VIOLET,
  },
  textBtnLogin: {
    fontSize: 15,
    color: COLOR.WHITE,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  separatorLine: {
    width: '20%',
    height: 1,
    backgroundColor: COLOR.GOVERNOR_BAY,
  },
  separatorText: {
    marginLeft: 5,
    marginRight: 5,
    color: COLOR.GOVERNOR_BAY,
  },
  socialContainer: {
    justifyContent: 'center',
    margin: 10,
    padding: 10,
    borderRadius: 15,
    backgroundColor: COLOR.GOVERNOR_BAY,
  },
  btnSocial: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    margin: 3,
    padding: 7,
    borderRadius: 10,
  },
  textBtnSocial: {
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 10,
  },
  textRegister: {
    color: COLOR.VIOLET,
  },
})
