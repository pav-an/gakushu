import { AsyncStorage } from 'react-native';

const STORE_NAME = 'calendars';

class LocalStorage {
  store;

  get = async () => {
    if (this.store) {
      return this.store;
    }
    const storeStr = await AsyncStorage.getItem(STORE_NAME);
    if (storeStr !== null) {
      this.store = JSON.parse(storeStr);
    } else {
      this.store = {};
    }
    return this.store;
  }

  save = value => {
    this.store = value;
    const storeStr = JSON.stringify(value);
    return AsyncStorage.setItem(STORE_NAME, storeStr);
  }
}

export default new LocalStorage();
