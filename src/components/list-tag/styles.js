import { StyleSheet } from 'react-native';

import { COLOR } from '../../constants';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  addInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  addInput: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderWidth: 2,
    borderRadius: 25,
    borderColor: COLOR.DUSTY_GRAY,
  },
  addBtn: {
    marginRight: 5,
  },
  flatList: {
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  itemBody: {
    flex: 1,
    flexDirection: 'row',
    margin: 5,
    padding: 5,
    borderWidth: 2,
    borderRadius: 25,
    borderColor: COLOR.GOVERNOR_BAY,
  },
  itemBodyAll: {
    height: 40,
    marginRight: 40,
  },
  itemTextWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  itemText: {
    marginLeft: 5,
  },
  itemDeleteBtn: {
    marginRight: 5,
  },
  editInputContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    left: 0,
    right: 0,
    height: 50,
    paddingHorizontal: 5,
    backgroundColor: COLOR.LIGHT_GRAY,
  },
  editInput: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 25,
    backgroundColor: COLOR.WHITE,
  },
});
