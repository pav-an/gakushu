import { StyleSheet } from 'react-native';
import { COLOR } from '../../constants';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.LIGHT_GRAY,
  },
  btnContainer: {
    height: 200,
    padding: 10,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginVertical: 10,
    borderRadius: 15,
    backgroundColor: COLOR.GOVERNOR_BAY,
  },
  btnText: {
    color: COLOR.WHITE,
    fontSize: 17,
  },
})
