import { StyleSheet } from 'react-native';

import { COLOR } from '../../constants';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  inputsContainer: {
    padding: 10,
  },
  inputWrapper: {
    marginTop: 10,
    paddingRight: 10,
  },
  input: {
    marginLeft: 5,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    height: 40,
    borderRadius: 25,
    backgroundColor: COLOR.GOVERNOR_BAY,
  },
  textBtn: {
    fontSize: 15,
    color: COLOR.WHITE,
  },
})
