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
  guild: {
    fontSize: 15,
    textAlign: 'center',
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
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: COLOR.VIOLET,
  },
  textBtn: {
    fontSize: 15,
    color: COLOR.WHITE,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 10,
  },
  textRegister: {
    color: COLOR.VIOLET,
  },
})
