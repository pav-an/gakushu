import { AsyncStorage } from 'react-native';

const QUESTION = 'question';

export const getLocalQuestion = async () => {
  const questionStr = await AsyncStorage.getItem(QUESTION);
  return JSON.parse(questionStr);
}

export const saveLocalQuestion = async question => {
  const questionStr = JSON.stringify(question);
  return await AsyncStorage.setItem(QUESTION, questionStr);
}
