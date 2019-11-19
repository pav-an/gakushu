import { StyleSheet } from 'react-native';
import { COLOR } from '../../constants';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    flex: 1,
    padding: 10,
  },
  profileTop: {
    flexDirection: 'row',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLOR.LIGHT_GRAY,
  },
  btnAvatarWrapper: {
    position: 'absolute',
    flexDirection: 'row',
    width: 100,
    height: 25,
    left: 0,
    bottom: 0,
    borderRadius: 15,
    backgroundColor: COLOR.GOVERNOR_BAY,
  },
  btnAvatar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnAvatarLeft: {
    borderRightWidth: 1,
    borderRightColor: COLOR.WHITE,
  },
  inputWrapper: {
    marginTop: 10,
    paddingRight: 10,
  },
  input: {
    marginLeft: 5,
  },
  iconEmail: {
    flexDirection: 'row',
  },
  textIconEmail: {
    fontSize: 15,
  },
  buttonsContainer: {
    flex: 1,
    padding: 10,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3,
    height: 40,
    borderRadius: 25,
    backgroundColor: COLOR.GOVERNOR_BAY,
  },
  btnWhite: {
    borderWidth: 1,
    borderColor: COLOR.GOVERNOR_BAY,
    backgroundColor: COLOR.WHITE,
  },
  textBtn: {
    fontSize: 15,
    color: COLOR.WHITE,
  },
  textBtnBlue: {
    fontSize: 15,
    color: COLOR.GOVERNOR_BAY,
  },
})
