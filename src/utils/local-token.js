import * as SecureStore from 'expo-secure-store';

const TOKEN = 'token';

export const getLocalToken = async () => {
  return await SecureStore.getItemAsync(TOKEN);  
}

export const saveLocalToken = async token => {
  return await SecureStore.setItemAsync(TOKEN, token);
}
