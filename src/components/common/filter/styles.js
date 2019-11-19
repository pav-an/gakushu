import { StyleSheet } from 'react-native';
import { COLOR } from '../../../constants';

export default StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  body: {
    width: '80%',
    backgroundColor: COLOR.WHITE,
    borderColor: COLOR.WILD_SAND,
    borderLeftWidth: 1,
  },
  selectedTextWrapper: {
    height: 30,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: COLOR.WILD_SAND,
  },
  selectedText: {
    fontSize: 12,
    color: COLOR.BLACK,
  },
  flatList: {
    alignItems: 'center',
  },
  itemText: {
    width: 90,
    margin: 5,
    padding: 10,
    fontSize: 12,
    color: COLOR.WHITE,
    textAlign: 'center',
    backgroundColor: COLOR.LIGHT_GRAY,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 75,
    backgroundColor: COLOR.WILD_SAND,
  },
  btn: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderRadius: 50,
    backgroundColor: COLOR.GOVERNOR_BAY,
  },
  btnWhite: {
    borderWidth: 3,
    backgroundColor: COLOR.WHITE,
    borderColor: COLOR.GOVERNOR_BAY,
  }, 
  btnText: {
    color: COLOR.WHITE,
    fontSize: 14,
  },
  btnWhiteText: {
    color: COLOR.GOVERNOR_BAY,
  },
});
