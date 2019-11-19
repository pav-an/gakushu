import * as Permissions from 'expo-permissions';

export default async (...reqPermissions) => {
  const { status, permissions } = await Permissions.getAsync(...reqPermissions);
  if (status === 'granted') {
    return true;
  }
  const askPermissons = [];
  for (let permissionName in permissions) {
    const { status } = permissions[ permissionName ];
    if (status !== 'granted') {
      askPermissons.push(permissionName)
    }
  }
  const res = await Permissions.askAsync(...askPermissons);
  return res.status === 'granted';
}
