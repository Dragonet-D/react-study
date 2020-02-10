/*
 * @Description: check user permission
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-06-27 17:19:46
 * @LastEditTime: 2019-08-01 21:35:09
 * @LastEditors: Kevin
 */

import userHelper from 'utils/userHelper';

export default function checkUserPermission(mk) {
  const { permissions } = JSON.parse(userHelper.get() || '');

  return permissions.includes(mk);
}
