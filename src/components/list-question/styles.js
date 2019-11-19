import { StyleSheet } from 'react-native';
import { UI_CONST, COLOR } from '../../constants';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  toolBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 2,
    paddingHorizontal: 10,
    height: 54,
    backgroundColor: COLOR.LIGHT_GRAY,
  },
  toolbarBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  badge: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 12,
    height: 12,
    top: 3,
    right: 3,
    borderRadius: 6,
    backgroundColor: COLOR.TAMARILLO,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLOR.WHITE, 
  },
  deleteText: {
    fontSize: 18,
    color: COLOR.CINNABAR,
  },
  flatList: {
    padding: 10,
    backgroundColor: COLOR.WHITE,
  },
  item: {
    flex: 1,
    margin: 2,
    aspectRatio: 1,
  },
  itemBorder: {
    borderWidth: 1,
    borderColor: COLOR.GALLERY,
  },
  redOverlay: {
    flex: 1,
    backgroundColor: COLOR.TAMARILLO,
    opacity: 0.7,
  },
  itemWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmDeleteBtn: {
    height: UI_CONST.NAV_BAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.BITTER_SWEET,
  },
  confirmDeleteBtnText: {
    fontSize: 18,
    color: COLOR.BLACK,
  },
});
