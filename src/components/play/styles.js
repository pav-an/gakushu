import { StyleSheet } from 'react-native';
import { COLOR } from '../../constants';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLOR.WHITE,
  },
  question: {
    flexDirection: 'row',
    margin: 10,
  },
  questionText: {
    marginLeft: 10,
    fontSize: 20,
  },
  answerTextWrapper: {
    marginTop: 5,
    alignItems: 'center',
  },
  answerHintWrapper: {
    flexDirection: 'row',
  },
  answerHint: {
    marginLeft: 10,
    fontSize: 16,
    color: COLOR.GOVERNOR_BAY,
  },
  answerText: {
    fontSize: 24,
    lineHeight: 35,
    color: COLOR.GOVERNOR_BAY,
  },
  imageContainer: {
    borderColor: COLOR.GOVERNOR_BAY,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  btnTextAnswer: {
    fontSize: 16,
    color: COLOR.BLACK,
  },

  nextBtnWrapper: {
    flex: 100,
    justifyContent: 'center',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginHorizontal: 20,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: COLOR.GOVERNOR_BAY,
  },
  nextBtnText: {
    fontSize: 16,
    color: COLOR.GOVERNOR_BAY,
  },

  answerWrapper: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  btnAnswer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnIconAnswer: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: COLOR.GOVERNOR_BAY,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backgroundGreen: {
    backgroundColor: COLOR.LIGHT_GREEN,
  },
  backgroundRed: {
    backgroundColor: COLOR.LIGHT_RED,
  },
});
