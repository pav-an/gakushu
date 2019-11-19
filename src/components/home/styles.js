import { StyleSheet } from 'react-native';
import { COLOR } from '../../constants';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  btnContainer: {
    flex: 1,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  btnIcon: {
    marginLeft: 20,
    marginBottom: 8,
  },
  btnTextWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 60,
  },
  msgWrapper: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
    padding: 10,
  },
  msgText: {
    fontSize: 16,
    color: COLOR.BLACK,
    textAlign: 'center',
    lineHeight: 20,
  },
  msgLargeText: {
    padding: 20,
    fontSize: 25,
  },
  btnTryWrapper: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  btnTry: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginHorizontal: 20, 
    borderRadius: 100,
    backgroundColor: COLOR.BLUE,
  },
  btnTryText: {
    fontSize: 16,
    color: COLOR.LIGHT_GRAY,
    backgroundColor: 'transparent',
  },
});
