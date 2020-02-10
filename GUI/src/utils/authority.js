import userHelper from './userHelper';

export function getAuthority() {
  const currentInfo = userHelper.get();
  let materialKeys;
  try {
    const objInfo = JSON.parse(currentInfo) || {};
    materialKeys = objInfo.permissions || [];
  } catch (e) {
    return [];
  }

  return materialKeys;
}
