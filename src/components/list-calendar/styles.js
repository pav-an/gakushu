import { StyleSheet } from 'react-native';
import { COLOR } from '../../constants';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  addBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: COLOR.LIGHT_GREEN,
  },
  flatList: {
    paddingLeft: 25,
    paddingRight: 25,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomColor: COLOR.VIOLET,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemBody: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemHourMinText: {
    fontSize: 30,
  },
  itemTimeWraper: {
    flexDirection: 'row',
  },
  itemTimeText: {
    fontSize: 13,
  },
  btnDelete: {
    alignItems: 'center',
    paddingLeft: 20,
  },
});
