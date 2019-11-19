import { StyleSheet } from 'react-native';
import { COLOR } from '../../constants';

export default StyleSheet.create({
  container: {
    flex: 1,
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
  inputWrapper: {
    marginTop: 10,
    paddingRight: 10,
    borderRadius: 25,
    backgroundColor: COLOR.WHITE,
  },
  input: {
    marginLeft: 5,
  },
  btnRegister: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: COLOR.VIOLET,
  },
  textBtnRegister: {
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
    margin: 10,
    padding: 10,
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: COLOR.GOVERNOR_BAY,
  },
  titleSocial: {
    textAlign: 'center',
    color: COLOR.WHITE,
  },
  btnSocialWrapper: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  btnSocial: { 
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 10,
  },
  textLogin: {
    color: COLOR.VIOLET,
  },
})
