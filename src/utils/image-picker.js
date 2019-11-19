import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import getPermission from './get-permission';

export const pickImage = async () => {
  if (!await getPermission(Permissions.CAMERA_ROLL)) {
    return;
  }

  return await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
  });
}

export const takeImage = async () => {
  if (!await getPermission(Permissions.CAMERA, Permissions.CAMERA_ROLL)) {
    return;
  }

  return await ImagePicker.launchCameraAsync({});
}
