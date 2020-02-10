import _ from 'lodash';
import { CURRENT } from './index';

const checkSinglePermission = mk => {
  const permissions = CURRENT || [];

  return permissions.includes(mk);
};

/**
 * Common check permissions method
 * @param { Permission judgment type string |array | Promise | Function } authority
 * @param { Your permission description  type:string} currentAuthority
 * @param { Passing components } target
 * @param { no pass components } Exception
 */
const checkPermissions = (authority, currentAuthority, target, Exception) => {
  // Retirement authority, return target;
  if (_.isEmpty(authority)) {
    return target;
  }
  // handle array
  if (Array.isArray(authority)) {
    const result = currentAuthority.some(item => authority.includes(item));
    if (result) {
      return target;
    }
    return Exception;
  }

  throw new Error('unsupported parameters');
};

export { checkPermissions, checkSinglePermission };

const check = (authority, target, Exception) => {
  return checkPermissions(authority, CURRENT, target, Exception);
};

export default check;
