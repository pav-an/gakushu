import { StyleSheet } from 'react-native';
import { COLOR } from '../../../constants';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageWrapper: {
    flex: 1,
    aspectRatio: 1.33,
    backgroundColor: COLOR.WHITE,
  },
});
