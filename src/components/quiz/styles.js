import { StyleSheet } from 'react-native';
import { COLOR } from '../../constants';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  btnPlay: {
    borderRadius: 100,
    backgroundColor: COLOR.BLUE,
  },
  btnPlayTitle: {
    fontSize: 25,
    color: COLOR.LIGHT_GRAY,
    backgroundColor: 'transparent',
  },

  recentIncorrectWrapper: {
    backgroundColor: COLOR.GOVERNOR_BAY,
    height: 150,
  },
  btnReplay: {
    flexDirection: 'row',
    padding: 6,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: COLOR.LIGHT_GRAY,
    borderBottomRightRadius: 100,
    borderTopRightRadius: 100,
  },
  btnReplayTitle: {
    marginLeft: 10,
    marginRight: 10,
    fontSize: 20,
    color: COLOR.WHITE,
  },
  replayIcon: {
    marginTop: 2,
  },
  flatList: {
    marginTop: 5,
    marginLeft: 10,
    marginBottom: 5,
  },
  item: {
    flex: 1,
    aspectRatio: 1,
    marginRight: 5,
    borderWidth: 1,
    borderColor: COLOR.GALLERY,
  },
  stat: {
    alignItems: 'center',
  },
  statSummary: {
    flexDirection: 'row',
    width: 80,
    height: 80,
    borderRadius: 100,
    backgroundColor: COLOR.GOVERNOR_BAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statSummaryText: {
    color: COLOR.WHITE,
    backgroundColor: 'transparent',
  },
  statTextSmall: {
    fontSize: 14,
  },
  statTextLarge: {
    fontSize: 30,
  },
  statDetail: {
    width: '100%',
    marginTop: 5,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    borderColor: COLOR.DUSTY_GRAY,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statBar: {
    marginTop: 0,
    marginLeft: 20,
    marginRight: 20,
  },
  statText: {
    fontSize: 18,
    color: COLOR.BLACK,
  },
  progressBar: {
    height: 12,
    padding: 0,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: COLOR.DUSTY_GRAY,
  },
  progressBarBlue: {
    backgroundColor: COLOR.GOVERNOR_BAY,
  },
  progressBarWhite: {
    backgroundColor: COLOR.WHITE,
  },
  progressBarGreen: {
    backgroundColor: COLOR.LIGHT_GREEN,
  },
  progressBarRed: {
    backgroundColor: COLOR.LIGHT_RED,
  },
  noLeftRadius: {
    borderLeftWidth: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  noRightRadius: {
    borderRightWidth: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },

  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  },
  resetBtnIcon: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    padding: 5,
    backgroundColor: COLOR.GOVERNOR_BAY,
    borderRadius: 100,
  },
  resetBtnText: {
    fontSize: 20,
    color: COLOR.BLACK,
  },

  topContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical:  7,
    marginHorizontal: 27,
  },
  msgText: {
    fontSize: 22,
    color: COLOR.BLACK,
    marginTop: 5,
  },
});
